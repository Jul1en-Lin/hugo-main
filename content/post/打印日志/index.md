+++
title = "打印日志"
slug = "打印日志"
date = "2026-02-04T07:47:28.000Z"
lastmod = "2026-02-04T07:53:33.000Z"
draft = false
categories = ["JavaEE进阶", "test"]
siyuan_id = "20260204154728-1xuxxqb"
siyuan_path = "/打印日志"
+++
# 打印日志

可在`application.yml`文件中配置

```java
# 设置日志文件的文件名
logging:
  file:
    name: spring-book.log
```

Spring中使用注解`@Slf4j`，即可打印日志，日志如下![image](assets/image-20260204154947-o2i69td.png)

log.info / debug，日常的信息打印

log.error，用于排错

log.warn，用于警告

‍
