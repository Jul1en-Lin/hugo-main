+++
date = '2026-03-24T17:16:51+08:00'
draft = true
title = '🎏 抽奖系统'
+++

# 抽奖系统项目

此博客旨在记录学习项目时遇到的各种技术问题，以便后续复盘学习，同时起到记录勉励作用。持续更新...


# 遇到的问题

## 技术细节错误

1. Mybatis字段处理器`TypeHandler`：写库时自动对手机号做对称加密，读库时自动解密还原，统一把加解密收敛在持久层，便于在注册校验（如重复手机号校验）中复用，避免业务层手动处理明文。

   - 测试的时候遇到了登录错误的问题

     测试已有管理员账户登录时，输入的正确的密码返回异常。开始以为是密码的Md5加密方式出了问题，<span data-type="text" style="background-color: var(--b3-font-background2);">日志捕捉后发现并没有走到验证密码这一步，且SQL语句查询正常</span>。继续往前排查，发现校验密码前会有用户手机号AES加密解密的过程，如果手机号对不上就会返回异常。<span data-type="text" style="background-color: var(--b3-font-background9);">问题出现在字段处理器的手机号字段的加密方式与解密方式不匹配，数据库存的是生成的十六进制密文，但解密时把这串十六进制文本当成普通UTF-8字节数组去解，导致登录查询阶段提前报错</span>。表现上是像密码错误，其实根本原因是`phone_number`解密失败。

## 各类相似方法取舍

- StringUtils

1. 用户名 / 密码校验时，hasLength与hasText区别

   - ​`StringUtils.hasLength(str)`​：只要不是 `null`​ 且长度 `> 0`​ 就是 `true`​，`" "`​（空格）会返回 `true`
   - ​`StringUtils.hasText(str)`​：要求有“可见文本”，即不是 `null`​、长度 `> 0`​，且至少有一个非空白字符，如果是`" "`​（全是空格）会返回 `false`

- ​`@Valid`​ 和 `@Validated`

1. 在Controller层请求体对象做字段检验（`@NotNull`​、`@NotBlank`​ 等）时，优先使用`@Valid`

   - ​`@Validated` 更适合做分组校验，适合后续新增 / 更新不同的规则

- 异常通知处理

1. 在校验参数时考虑是否根据不同的错误设置不同状态码 or 默认返回200

   感觉接口能正常工作，应该返回200，统一结果返回时可以看到具体问题

   - 如传参错误本质上是客户端请求错误，理应返回4xx，且客户端SDK、重试策略、缓存策略也常依赖状态码

## 反序列化问题

### 问题背景

在奖品创建接口中，由于需要上传奖品的属性以及奖品的图片，是一份表单格式的数据，所以用到 <u>**​`@RequestPart`​**</u>，在用到此注解中产生了一些问题。

接口为：

```java
@PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public Long createPrize(@RequestPart("params") @Valid CreatePrizeRequest createPrizeRequest,
                        @RequestPart("file") MultipartFile file)
```

测试工具使用 `Body -> form-data` 传参：

![image](assets/image-20260313204954-y2lq4n3.png)

- ​`params`：text，内容为 JSON
- ​`file`：图片文件

### 报错

1. ​`Required part 'params' is not present`

- 阶段：Multipart part 匹配阶段
- 触发原因：后端按 `@RequestPart("params")` 查找 part，但请求中没有被识别为该 part（key 不一致、请求头/boundary 异常、part 类型不匹配等）

由于`@RequestPart` 不是简单地拿字符串，它需要一个可被消息转换器识别并转换的 part

- 如果 `params`​ 是标准 JSON part（`application/json`），Spring 默认转换器通常可直接反序列化
- 如果 `params`​ 作为 `text/plain` 发送，默认链路可能无法稳定命中 JSON 反序列化，需要自定义 converter

### 踩坑点

1. 项目版本及依赖差异：

- 当前项目（Spring Boot 4）实际使用 `tools.jackson.*`
- 直接照搬 `com.fasterxml.*` 版本的 converter 会出现类找不到或不兼容

2. 过时的 API：

当时想复用现成的converter，将JSON字符串很好的解析成需要的对象属性，但由于版本差异老抽象类已经不支持使用了

![image](assets/image-20260313211103-9apl4e5.png)

### 改进

#### 自定义读取型 converter

自定义`MultipartJackson2HttpMessageConverter`类

- 让它实现 `HttpMessageConverter<Object>`
- 并支持 `application/json`​、`text/plain`​、`application/octet-stream`当设成 Text 传 JSON，也能被识别
- 仅支持读取（`canWrite=false`），避免影响现有的响应序列化
- 使用 `tools.jackson.databind.ObjectMapper` 主流依赖进行反序列化

#### 实现配置类：在 MVC 转换器链中优先注册

自定义`MessageConverterConfig`类

- 通过 `extendMessageConverters` 注册
- 放在索引 `0`​，保证优先匹配 `@RequestPart("params")`

### 两个类的关系

- ​`MultipartJackson2HttpMessageConverter`​：负责 ***<u>“怎么转换”</u>***
- ​`MessageConverterConfig`​：负责 ***<u>“把谁注册进 Spring，并定义优先级”</u>***

### 运行逻辑

1. 请求进来，命中 `@RequestPart("params")`
2. Spring 在转换器列表里找谁能读这个 part
3. ​`MessageConverterConfig`​ 提前注册的 `MultipartJackson2HttpMessageConverter` 被选中
4. converter 调 `ObjectMapper.readValue(...)`​ 转成 `CreatePrizeRequest`类

### 测试用例

- Method：`POST`
- URL：`/prize/create`
- Body：`form-data`
- ​`params`​：Type=`Text`，值：

```json
{"name":"小车模","description":"1:64车模","price":200}
```

- ​`file`​：Type=`File`，选择图片
- 不手动改 `Content-Type`，让工具自动生成 multipart boundary

### 可复用代码

当接口需要同时接收“文件 + JSON 文本”且前端以 `form-data text` 方式传 JSON 时，最稳妥做法是：

- 保持 `@RequestPart` 接口语义
- 增加只读型 multipart JSON converter
- 在 MVC 链路中前置注册

这样既保留参数校验能力（`@Valid`​），也能兼容测试工具常见的 `text/plain` JSON 传法

---

C**onverter类：**

```java
/**
 * 自定义 multipart 参数转换器。
 * 目标是让 @RequestPart("params") 能解析 text/plain 的 JSON 文本。
 */
@Component
public class MultipartJackson2HttpMessageConverter implements HttpMessageConverter<Object> {

    private static final List<MediaType> SUPPORTED_MEDIA_TYPES = Arrays.asList(
            MediaType.APPLICATION_JSON,
            MediaType.TEXT_PLAIN,
            MediaType.APPLICATION_OCTET_STREAM
    );

    private final ObjectMapper objectMapper;

    public MultipartJackson2HttpMessageConverter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean canRead(Class<?> clazz, MediaType mediaType) {
        return isSupportedMediaType(mediaType);
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        return false;
    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        return SUPPORTED_MEDIA_TYPES;
    }

    @Override
    public Object read(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        // multipart 中 params 为 text 时，按 UTF-8 文本读取后再转对象。
        byte[] bodyBytes = inputMessage.getBody().readAllBytes();
        String body = new String(bodyBytes, StandardCharsets.UTF_8);
        if (body.isBlank()) {
            throw new HttpMessageNotReadableException("请求体为空", inputMessage);
        }
        try {
            return objectMapper.readValue(body, clazz);
        }
        catch (Exception e) {
            throw new HttpMessageNotReadableException("params不是合法JSON", e, inputMessage);
        }
    }

    @Override
    public void write(Object o, MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        // 该转换器只用于请求反序列化，不参与响应序列化。
        throw new HttpMessageNotWritableException("MultipartJackson2HttpMessageConverter不支持写入");
    }

    private boolean isSupportedMediaType(MediaType mediaType) {
        if (mediaType == null) {
            return true;
        }
        return SUPPORTED_MEDIA_TYPES.stream().anyMatch(mediaType::isCompatibleWith);
    }
}
```

**Config类：**

```java
/**
 * 注册自定义消息转换器，兼容 multipart/form-data 中 text 类型的 JSON 参数。
 */
@Configuration
public class MessageConverterConfig implements WebMvcConfigurer {

    private final MultipartJackson2HttpMessageConverter multipartJackson2HttpMessageConverter;

    public MessageConverterConfig(MultipartJackson2HttpMessageConverter multipartJackson2HttpMessageConverter) {
        this.multipartJackson2HttpMessageConverter = multipartJackson2HttpMessageConverter;
    }

    /**
     * 将自定义转换器放在前面，优先处理 @RequestPart 场景下的 params 文本反序列化。
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(0, multipartJackson2HttpMessageConverter);
    }
}
```

---

## RedisTemplate 默认序列化器导致 JSON 缓存解析失败

### 问题背景

在抽奖系统项目中，活动服务提供了 `getDetail`​ 接口用于查询活动详情。为提升查询性能，在**创建活动时将活动详情序列化为 JSON 并缓存到 Redis**，后续查询时优先读取缓存

核心代码流程如下：

```java
// 写入缓存：先用 JacksonUtil 手动序列化为 JSON 字符串，再存入 Redis
String json = JacksonUtil.serialize(detailDto);
redisTemplate.opsForValue().set(key, json, CACHE_TIMEOUT);

// 读取缓存：从 Redis 取出 JSON 字符串，再用 JacksonUtil 手动反序列化
String json = redisTemplate.opsForValue().get(key);
ActivityDetailDto dto = JacksonUtil.deSerialize(json, ActivityDetailDto.class);
```

### 问题现象

调用 `getDetail`​ 接口时，从 Redis 读取到了缓存数据，但**反序列化阶段抛出异常**：

```
Cannot parse JSON
Caused by: tools.jackson.core.exc.StreamReadException: 
  Illegal character ((CTRL-CHAR, code 0)): 
  only regular white space (\r, \n, \t) is allowed between tokens
```

通过 Redis 可视化工具查看缓存内容，发现存储的 value **前面有大量 NUL（\0）控制字符**：

![image](assets/image-20260324171152-p1bw1p8.png)

JSON 本身内容是正确的，但前缀的 NUL 字符导致 Jackson 解析器无法识别。

反序列化失败后，代码进入 catch 分支，执行了 `redisTemplate.delete(key)`​ 将缓存删除，造成**缓存永远无法命中**，每次查询都回源数据库，这非常影响性能

### 排查过程

#### 初步怀疑：JacksonUtil 序列化问题？

最初怀疑是 `JacksonUtil.serialize()` 方法在序列化过程中引入了控制字符。但审查代码后发现：

```java
public static String serialize(Object object) {
    return JacksonUtil.tryParse(() -> OBJECT_MAPPER.writeValueAsString(object));
}
```

​`ObjectMapper.writeValueAsString()`​ 是 Jackson 标准 API，**输出的一定是合法的 JSON 字符串**，不可能产生 NUL 前缀，故排除此怀疑

#### 定位问题：RedisTemplate 默认序列化器

进一步检查发现，`ActivityServiceImpl` 中注入的是：

```java
@Autowired
private RedisTemplate<String, String> redisTemplate;
```

但项目中**没有自定义 Redis 配置类**。这意味着 Spring Boot 自动配置的 `RedisTemplate`​ 使用的是**默认序列化器**

查阅 Spring Data Redis 源码，`RedisTemplate`​ 默认的 key 和 value 序列化器都是 `JdkSerializationRedisSerializer`：

```java
// org.springframework.data.redis.core.RedisTemplate
if (this.defaultSerializer == null) {
    this.defaultSerializer = new JdkSerializationRedisSerializer(...);
}
```

> ⚠️ 注意：虽然泛型声明为 `RedisTemplate<String, String>`​，但 **泛型只是编译期约束**，实际运行时序列化器仍然是默认的 `JdkSerializationRedisSerializer`，它会对任何对象（包括 String）执行 JDK 对象序列化。

#### 还原完整问题链路

```
                  写入阶段
JacksonUtil.serialize(dto)  →  纯 JSON 字符串 ✅
          ↓
RedisTemplate.set(key, json)
          ↓
JdkSerializationRedisSerializer.serialize(json)  →  JDK 二进制序列化 ❌
          ↓                                          (添加 NUL 开头的二进制头)
Redis 存储: [NUL NUL NUL ... ] + {"activityId":21,...}


                  读取阶段
RedisTemplate.get(key)
          ↓
JdkSerializationRedisSerializer.deserialize(bytes)  →  还原出带 NUL 的字符串
          ↓
JacksonUtil.deSerialize(json)  →  解析失败！遇到非法控制字符 ❌
```

所以可以**总结问题根因了**：`JdkSerializationRedisSerializer`​ 对已经是 JSON 字符串的 value **做了二次序列化**，在 JSON 前面添加了 JDK 序列化协议的二进制头（体现为 NUL 控制字符），导致反序列化时 Jackson 无法解析

#### 额外发现：set() 方法参数误用

```java
redisTemplate.opsForValue().set(key, value, CACHE_TIMEOUT);
```

这里第三个参数 `CACHE_TIMEOUT`​（值为 3600L）本意是设置超时时间，但 **​`set(K, V, long)`​** ​ **的三参数重载中第三个参数是 offset（偏移量）** ，并非过期时间。正确的超时设置需要使用四参数版本：

```java
redisTemplate.opsForValue().set(key, value, CACHE_TIMEOUT, TimeUnit.SECONDS);
```

#### 对比项目中的正确用法

有趣的是，同项目中 `UserServiceImpl`​ 的发送邮箱验证码接口`sendEmailCodeInternal`​里，缓存邮箱验证码使用的是 `StringRedisTemplate`：

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
```

​`StringRedisTemplate`​ 是 `RedisTemplate<String, String>`​ 的子类，**构造函数中已将序列化器设置为** **​`StringRedisSerializer`​**，所以邮箱验证码的存取从未出现过类似问题。

---

### 解决方案

#### 方案思路

既然问题出在"手动 Jackson 序列化 + 默认 JDK 序列化器"的冲突，我选择**让 RedisTemplate 自身接管 JSON 序列化**，彻底移除手动转换步骤。

#### 新增 Redis 配置类

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // key 使用 String 序列化
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // value 使用 Jackson JSON 序列化，自动完成对象 ↔ JSON 转换
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

​`GenericJackson2JsonRedisSerializer`​ 会在 JSON 中自动写入 `@class` 类型信息，读取时可以自动还原为正确的 Java 类型

更改后的Redis存入的数据如图，已经能正常序列化：

![image](assets/image-20260324171112-a22qtvn.png)

#### 简化业务代码

**写入缓存** —— 直接存对象：

```diff
- redisTemplate.opsForValue().set(key, JacksonUtil.serialize(detailDto), CACHE_TIMEOUT);
+ redisTemplate.opsForValue().set(key, detailDto, CACHE_TIMEOUT, TimeUnit.SECONDS);
```

**读取缓存** —— 直接取对象：

```diff
- String json = redisTemplate.opsForValue().get(key);
- ActivityDetailDto dto = JacksonUtil.deSerialize(json, ActivityDetailDto.class);
+ Object cached = redisTemplate.opsForValue().get(key);
+ if (cached instanceof ActivityDetailDto dto) {
+     return dto;
+ }
```

完全移除了 `JacksonUtil` 在缓存场景的使用，以及之前为兼容脏数据写的大段 fallback 解析逻辑。

---

### 核心收获

#### RedisTemplate vs StringRedisTemplate

|特性|​`RedisTemplate`|​`StringRedisTemplate`|
| -------------------| ------------------------| ----------------|
|默认序列化器|​`JdkSerializationRedisSerializer`|​`StringRedisSerializer`|
|存入 Redis 的格式|JDK 二进制（不可读）|纯文本（可读）|
|取出后类型|Object（需强转）|String|
|适用场景|需自定义序列化器后使用|简单字符串 KV|

> 📌 **教训**：使用 `RedisTemplate`​ 时，**必须显式配置序列化器**，否则默认的 JDK 序列化会与手动 JSON 序列化产生冲突。

#### 常见的 Redis 序列化器选择

|序列化器|存储格式|类型信息|适用场景|
| ----------| ---------------| ----------| ---------------------------------|
|​`JdkSerializationRedisSerializer`|二进制|内嵌|❌ 不推荐，可读性差且有安全风险|
|​`StringRedisSerializer`|纯字符串|无|简单字符串、需手动 JSON 转换|
|​`Jackson2JsonRedisSerializer`|JSON|无|明确类型的场景|
|​`GenericJackson2JsonRedisSerializer`|JSON + @class|有|通用 JSON 对象缓存 ✅|

#### ​`set()` 方法重载辨析

```java
// ❌ 错误：第三个参数是 offset（偏移量），不是超时时间
set(K key, V value, long offset)

// ✅ 正确：显式指定时间单位的过期时间
set(K key, V value, long timeout, TimeUnit unit)

// ✅ 正确：使用 Duration 的过期时间
set(K key, V value, Duration timeout)
```

---

### 总结

这个问题的表面现象是"JSON 解析失败"，但深层原因是**对 RedisTemplate 默认行为的认知不足**。整个排查链条为：

```
JSON 解析报控制字符异常
   → Redis 中缓存值有 NUL 前缀 
   → JdkSerializationRedisSerializer 对 JSON 字符串二次序列化
   → 未自定义 RedisTemplate 的序列化器配置
```

最终通过添加 `RedisConfig`​ 配置类，使用 `GenericJackson2JsonRedisSerializer` 让 RedisTemplate 自身处理 JSON 序列化，从根本上解决了问题，同时也大幅简化了业务代码。

---