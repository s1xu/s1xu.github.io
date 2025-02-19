---
title: 记一次Nacos 403问题排查
date: 2025-02-17 22:17:35
updated: 2025-02-17 22:17:35
categories:
tags: Java
---

# 背景

项目中需要引入三方提供的基础数据，故通过maven方式引入如下：

```
<dependency>
   <groupId>com.xxx.repo</groupId>
   <artifactId>xxx-base-core</artifactId>
   <version>1.0.0-SNAPSHOT</version>
</dependency
```

然后编写相关业务代码后Debug启动报错如下：

```
com.alibaba.nacos.api.exception.NacosException: <html><body><h1>Whitelabel Error Page</h1><p>This application has no explicit mapping for /error, so you are seeing this as a fallback.</p><div id='created'>Mon Feb 17 16:49:32 CST 2025</div><div>There was an unexpected error (type=Forbidden, status=403).</div><div>unknown user!</div></body></html>
	at com.alibaba.nacos.client.config.impl.ClientWorker.getServerConfig(ClientWorker.java:306) ~[nacos-client-1.4.1.jar:na]
	at com.alibaba.nacos.client.config.NacosConfigService.getConfigInner(NacosConfigService.java:155) ~[nacos-client-1.4.1.jar:na]
	at com.alibaba.nacos.client.config.NacosConfigService.getConfig(NacosConfigService.java:98) ~[nacos-client-1.4.1.jar:na]
	at com.alibaba.nacos.spring.context.event.config.EventPublishingConfigService.getConfig(EventPublishingConfigService.java:63) ~[nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.util.NacosUtils.getContent(NacosUtils.java:386) ~[nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.util.config.NacosConfigLoader.load(NacosConfigLoader.java:92) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.core.env.AbstractNacosPropertySourceBuilder.doBuild(AbstractNacosPropertySourceBuilder.java:184) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.core.env.AbstractNacosPropertySourceBuilder.build(AbstractNacosPropertySourceBuilder.java:114) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.core.env.NacosPropertySourcePostProcessor.buildNacosPropertySources(NacosPropertySourcePostProcessor.java:201) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.core.env.NacosPropertySourcePostProcessor.processPropertySource(NacosPropertySourcePostProcessor.java:183) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.core.env.NacosPropertySourcePostProcessor.postProcessBeanFactory(NacosPropertySourcePostProcessor.java:168) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.util.NacosBeanUtils.invokeNacosPropertySourcePostProcessor(NacosBeanUtils.java:416) [nacos-spring-context-1.1.1.jar:na]
	at com.alibaba.nacos.spring.context.annotation.config.NacosConfigBeanDefinitionRegistrar.registerBeanDefinitions(NacosConfigBeanDefinitionRegistrar.java:74) [nacos-spring-context-1.1.1.jar:na]
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.lambda$loadBeanDefinitionsFromRegistrars$1(ConfigurationClassBeanDefinitionReader.java:363) [spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at java.util.LinkedHashMap.forEach(LinkedHashMap.java:684) ~[na:1.8.0_371]
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitionsFromRegistrars(ConfigurationClassBeanDefinitionReader.java:362) [spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitionsForConfigurationClass(ConfigurationClassBeanDefinitionReader.java:145) [spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitions(ConfigurationClassBeanDefinitionReader.java:117) [spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.processConfigBeanDefinitions(ConfigurationClassPostProcessor.java:327) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.postProcessBeanDefinitionRegistry(ConfigurationClassPostProcessor.java:232) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanDefinitionRegistryPostProcessors(PostProcessorRegistrationDelegate.java:275) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:95) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.invokeBeanFactoryPostProcessors(AbstractApplicationContext.java:706) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:532) ~[spring-context-5.1.18.RELEASE.jar:5.1.18.RELEASE]
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:141) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:744) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:391) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:312) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1215) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1204) ~[spring-boot-2.1.17.RELEASE.jar:2.1.17.RELEASE]
	at com.s1xu.xxxx.rest.BootApplication.main(BootApplication.java:28) ~[classes/:na]
```

# 定位问题

看到报错`unknown user!`  并且`status=403` 第一反应是不是测试环境nacos环境出问题了

遂启动另一个项目没问题，然后开始debug



从报错第一行进入`ClientWorker.java:306` 

定位到抛错的地方是

```
case HttpURLConnection.HTTP_FORBIDDEN: {
    LOGGER.error("[{}] [sub-server-error] no right, dataId={}, group={}, tenant={}", agent.getName(),
                 dataId, group, tenant);
    throw new NacosException(result.getCode(), result.getMessage());
}
```

遂向上寻找查看当前方法

```java
public String[] getServerConfig(String dataId, String group, String tenant, long readTimeout)
  throws NacosException {
  // ....
  HttpRestResult<String> result = null;
  try {
    Map<String, String> params = new HashMap<String, String>(3);
    if (StringUtils.isBlank(tenant)) {
      params.put("dataId", dataId);
      params.put("group", group);
    } else {
      params.put("dataId", dataId);
      params.put("group", group);
      params.put("tenant", tenant);
    }
    // 这里
    result = agent.httpGet(Constants.CONFIG_CONTROLLER_PATH, null, params, agent.getEncode(), readTimeout); 
  } catch (Exception ex) {
    String message = String
      .format("[%s] [sub-server] get server config exception, dataId=%s, group=%s, tenant=%s",
              agent.getName(), dataId, group, tenant);
    LOGGER.error(message, ex);
    throw new NacosException(NacosException.SERVER_ERROR, ex);
  }

  switch (result.getCode()) {
      // other case...
    case HttpURLConnection.HTTP_FORBIDDEN: {
      LOGGER.error("[{}] [sub-server-error] no right, dataId={}, group={}, tenant={}", agent.getName(),
                   dataId, group, tenant);
      throw new NacosException(result.getCode(), result.getMessage());
    }
    default: {
      LOGGER.error("[{}] [sub-server-error]  dataId={}, group={}, tenant={}, code={}", agent.getName(),
                   dataId, group, tenant, result.getCode());
      throw new NacosException(result.getCode(),
                               "http error, code=" + result.getCode() + ",dataId=" + dataId + ",group=" + group + ",tenant="
                               + tenant);
    }
  }
}
```

判断`result.getCode()` ，如果code = HttpURLConnection.HTTP_FORBIDDEN 就会抛错

于是问题点就只能是在`result = agent.httpGet(Constants.CONFIG_CONTROLLER_PATH, null, params, agent.getEncode(), readTimeout);`这一行了

于是进入`agent.httpGet`内

```java
@Override
public HttpRestResult<String> httpGet(String path, Map<String, String> headers, Map<String, String> paramValues,
                                      String encode, long readTimeoutMs) throws Exception {
  final long endTime = System.currentTimeMillis() + readTimeoutMs;
  injectSecurityInfo(paramValues);
  String currentServerAddr = serverListMgr.getCurrentServerAddr();
  int maxRetry = this.maxRetry;
  HttpClientConfig httpConfig = HttpClientConfig.builder()
    .setReadTimeOutMillis(Long.valueOf(readTimeoutMs).intValue())
    .setConTimeOutMillis(ConfigHttpClientManager.getInstance().getConnectTimeoutOrDefault(100)).build();
  do {
    try {
      Header newHeaders = getSpasHeaders(paramValues, encode);
      if (headers != null) {
        newHeaders.addAll(headers);
      }
      Query query = Query.newInstance().initParams(paramValues);
      // 这里
      HttpRestResult<String> result = NACOS_RESTTEMPLATE
        .get(getUrl(currentServerAddr, path), httpConfig, newHeaders, query, String.class);
      if (isFail(result)) {
        LOGGER.error("[NACOS ConnectException] currentServerAddr: {}, httpCode: {}",
                     serverListMgr.getCurrentServerAddr(), result.getCode());
      } else {
        // Update the currently available server addr
        serverListMgr.updateCurrentServerAddr(currentServerAddr);
        return result;
      }
    } catch (ConnectException connectException) {
      LOGGER.error("[NACOS ConnectException httpGet] currentServerAddr:{}, err : {}",
                   serverListMgr.getCurrentServerAddr(), connectException.getMessage());
    } catch (SocketTimeoutException socketTimeoutException) {
      LOGGER.error("[NACOS SocketTimeoutException httpGet] currentServerAddr:{}， err : {}",
                   serverListMgr.getCurrentServerAddr(), socketTimeoutException.getMessage());
    } catch (Exception ex) {
      LOGGER.error("[NACOS Exception httpGet] currentServerAddr: " + serverListMgr.getCurrentServerAddr(),
                   ex);
      throw ex;
    }

    if (serverListMgr.getIterator().hasNext()) {
      currentServerAddr = serverListMgr.getIterator().next();
    } else {
      maxRetry--;
      if (maxRetry < 0) {
        throw new ConnectException(
          "[NACOS HTTP-GET] The maximum number of tolerable server reconnection errors has been reached");
      }
      serverListMgr.refreshCurrentServerAddr();
    }

  } while (System.currentTimeMillis() <= endTime);

  LOGGER.error("no available server");
  throw new ConnectException("no available server");
}	
```

一路F8

在`HttpRestResult<String> result = NACOS_RESTTEMPLATE
                        .get(getUrl(currentServerAddr, path), httpConfig, newHeaders, query, String.class);`这一行跑飞了，所以问题大概率出现在这里面，重新断点进入一路F8

```java
public <T> HttpRestResult<T> get(String url, HttpClientConfig config, Header header, Query query, Type responseType)
  throws Exception {
  RequestHttpEntity requestHttpEntity = new RequestHttpEntity(config, header, query);
   // 这里
  return execute(url, HttpMethod.GET, requestHttpEntity, responseType);
}
```

继续跟进这个`execute`

```java
@Override
public HttpClientResponse execute(URI uri, String httpMethod, RequestHttpEntity requestHttpEntity)
  throws Exception {
  final Object body = requestHttpEntity.getBody();
  final Header headers = requestHttpEntity.getHeaders();
  replaceDefaultConfig(requestHttpEntity.getHttpClientConfig());

  HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
  Map<String, String> headerMap = headers.getHeader();
  if (headerMap != null && headerMap.size() > 0) {
    for (Map.Entry<String, String> entry : headerMap.entrySet()) {
      conn.setRequestProperty(entry.getKey(), entry.getValue());
    }
  }

  conn.setConnectTimeout(this.httpClientConfig.getConTimeOutMillis());
  conn.setReadTimeout(this.httpClientConfig.getReadTimeOutMillis());
  conn.setRequestMethod(httpMethod);
  if (body != null && !"".equals(body)) {
    String contentType = headers.getValue(HttpHeaderConsts.CONTENT_TYPE);
    String bodyStr = JacksonUtils.toJson(body);
    if (MediaType.APPLICATION_FORM_URLENCODED.equals(contentType)) {
      // 这里
      Map<String, String> map = JacksonUtils.toObj(bodyStr, HashMap.class);
      bodyStr = HttpUtils.encodingParams(map, headers.getCharset());
    }
    if (bodyStr != null) {
      conn.setDoOutput(true);
      byte[] b = bodyStr.getBytes();
      conn.setRequestProperty("Content-Length", String.valueOf(b.length));
      OutputStream outputStream = conn.getOutputStream();
      outputStream.write(b, 0, b.length);
      outputStream.flush();
      IoUtils.closeQuietly(outputStream);
    }
  }
  conn.connect();
  return new JdkHttpClientResponse(conn);
}
```

F8到` Map<String, String> map = JacksonUtils.toObj(bodyStr, HashMap.class); `这一行是又飞了，所以问题大概率在这里

但是此时控制台也没有error，于是选中这行 option + F8打开Evaluate窗口执行，会发现如下报错：

```
Method threw 'java.lang.NoSuchMethodError' exception.
com.fasterxml.jackson.core.JsonParser.getReadCapabilities()Lcom/fasterxml/jackson/core/util/JacksonFeatureSet;
java.lang.NoSuchMethodError: com.fasterxml.jackson.core.JsonParser.getReadCapabilities()Lcom/fasterxml/jackson/core/util/JacksonFeatureSet;
```

报错`NoSuchMethodError` 下面一行提示jackson包，于是检查项目依赖，发现jackson-core和jackson-databind两个依赖的版本不一致，nacos下core是2.10.4，而databind是2.12.3，全局搜索发现项目中引用了
```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.12.3</version>
</dependency>
```

于是修改成nacos依赖的jackson一致的版本2.10.4，刷新maven，重新debug，成功读取配置





# 过程

其实在debug中途会发现登录时accessToken为空，定位这个问题会发现最初定位的`httpGet`中的第二行`njectSecurityInfo(paramValues);` 

```java
private void injectSecurityInfo(Map<String, String> params) {
  if (StringUtils.isNotBlank(securityProxy.getAccessToken())) {
    params.put(Constants.ACCESS_TOKEN, securityProxy.getAccessToken());
  }
  if (StringUtils.isNotBlank(namespaceId) && !params.containsKey(SpasAdapter.TENANT_KEY)) {
    params.put(SpasAdapter.TENANT_KEY, namespaceId);
  }
}
```

如果securityProxy.getAccessToken()不为空，则put accessToken，值为securityProxy.getAccessToken()

```java
public class ServerHttpAgent implements HttpAgent {
    
    private static final Logger LOGGER = LogUtils.logger(ServerHttpAgent.class);
    
    private static final NacosRestTemplate NACOS_RESTTEMPLATE = ConfigHttpClientManager.getInstance()
            .getNacosRestTemplate();
    
  	// 这里
    private SecurityProxy securityProxy; 
    
    private String namespaceId;
    
    private final long securityInfoRefreshIntervalMills = TimeUnit.SECONDS.toMillis(5);
    
    private ScheduledExecutorService executorService;
```

在这个`private SecurityProxy securityProxy` 成员变量上打上断点重新debug

会发现赋值的地方就在`injectSecurityInfo` 方法上面

```java
public ServerHttpAgent(Properties properties) throws NacosException {
  this.serverListMgr = new ServerListManager(properties);
  this.securityProxy = new SecurityProxy(properties, NACOS_RESTTEMPLATE);
  this.namespaceId = properties.getProperty(PropertyKeyConst.NAMESPACE);
  init(properties);
  // 这里
  this.securityProxy.login(this.serverListMgr.getServerUrls());

  // init executorService
  this.executorService = new ScheduledThreadPoolExecutor(1, new ThreadFactory() {
    @Override
    public Thread newThread(Runnable r) {
      Thread t = new Thread(r);
      t.setName("com.alibaba.nacos.client.config.security.updater");
      t.setDaemon(true);
      return t;
    }
  });

  this.executorService.scheduleWithFixedDelay(new Runnable() {
    @Override
    public void run() {
      securityProxy.login(serverListMgr.getServerUrls());
    }
  }, 0, this.securityInfoRefreshIntervalMills, TimeUnit.MILLISECONDS);   
}
    
```

进去这个login方法

```java
public boolean login(List<String> servers) {
  try {
    if ((System.currentTimeMillis() - lastRefreshTime) < TimeUnit.SECONDS
        .toMillis(tokenTtl - tokenRefreshWindow)) {
      return true;
    }

    for (String server : servers) {
      // 这里
      if (login(server)) {
        lastRefreshTime = System.currentTimeMillis();
        return true;
      }
    }
  } catch (Throwable ignore) {
  }

  return false;
}
```

继续进入login

```java
public boolean login(String server) {
  if (StringUtils.isNotBlank(username)) {
    Map<String, String> params = new HashMap<String, String>(2);
    Map<String, String> bodyMap = new HashMap<String, String>(2);
    params.put("username", username);
    bodyMap.put("password", password);
    String url = "http://" + server + contextPath + LOGIN_URL;

    if (server.contains(Constants.HTTP_PREFIX)) {
      url = server + contextPath + LOGIN_URL;
    }
    try {
      HttpRestResult<String> restResult = nacosRestTemplate
        .postForm(url, Header.EMPTY, Query.newInstance().initParams(params), bodyMap, String.class); // 这里
      if (!restResult.ok()) {
        SECURITY_LOGGER.error("login failed: {}", JacksonUtils.toJson(restResult));
        return false;
      }
      JsonNode obj = JacksonUtils.toObj(restResult.getData());
      if (obj.has(Constants.ACCESS_TOKEN)) {
        accessToken = obj.get(Constants.ACCESS_TOKEN).asText();
        tokenTtl = obj.get(Constants.TOKEN_TTL).asInt();
        tokenRefreshWindow = tokenTtl / 10;
      }
    } catch (Exception e) {
      SECURITY_LOGGER.error("[SecurityProxy] login http request failed"
                            + " url: {}, params: {}, bodyMap: {}, errorMsg: {}", url, params, bodyMap, e.getMessage());
      return false;
    }
  }
  return true;
}
```

会在`nacosRestTemplate
        .postForm(url, Header.EMPTY, Query.newInstance().initParams(params), bodyMap, String.class)`

处跑飞，断点这里重新debug进去

```java
public <T> HttpRestResult<T> postForm(String url, Header header, Query query, Map<String, String> bodyValues,
                                      Type responseType) throws Exception {
  RequestHttpEntity requestHttpEntity = new RequestHttpEntity(
    header.setContentType(MediaType.APPLICATION_FORM_URLENCODED), query, bodyValues);
  return execute(url, HttpMethod.POST, requestHttpEntity, responseType);
}
```

会发现一个熟悉的地方`execute`，最终也会回到`Map<String, String> map = JacksonUtils.toObj(bodyStr, HashMap.class);`这个地方，但是回看login最外层，`securityProxy.login()` 会发现异常catch了，但是什么也没做，所以就会回到最初的异常403

# 总结

经过debug nacos启动过程，会发现这个403错误是因为login失败，但是异常被catch而没有日志或抛出。

失败原因是nacos底层引用的jackson版本和项目中引用的jackson两个版本不一致。

实际异常是

```text
Method threw 'java.lang.NoSuchMethodError' exception.
com.fasterxml.jackson.core.JsonParser.getReadCapabilities()Lcom/fasterxml/jackson/core/util/JacksonFeatureSet;
java.lang.NoSuchMethodError: com.fasterxml.jackson.core.JsonParser.getReadCapabilities()Lcom/fasterxml/jackson/core/util/JacksonFeatureSet;
```

