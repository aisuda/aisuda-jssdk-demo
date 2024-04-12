# 爱速搭 JSSDK 使用示例

此项目是基于 `React` 框架开发，使用 `create-react-app` 脚手架创建的示例项目，主要作用是展示如何将通过爱速搭 `JSSDK` 功能导出的普通页面嵌入到业务系统中。

## 项目目录结构说明

```
.
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── index.tsx // 当前项目主入口文件
│   ├── App.tsx // 当前项目路由配置文件
│   ├── components
│   │   └── AisudaPage.tsx // 爱速搭 Jssdk 公共组件，主要作用是加载不同的页面资源以及管理一些全局配置
│   ├── reportWebVitals.ts
│   ├── route
│   │   ├── About.tsx
│   │   ├── Home.tsx
│   │   └── Jssdk.tsx // 爱速搭 Jssdk 导出的普通页面
│   └── styles
│       ├── App.css
│       └── index.css
└── tsconfig.json
├── README.md
├── package.json
```

## JSSDK 导出说明

在爱速搭平台使用 `JSSDK` 功能导出普通页面并上传到对象存储后，会得到一个基于 `React` 的 `公共组件代码` 和 `示例代码`。

### 代码说明

- `公共组件代码` 包含一个 `AisudaPage.tsx` 文件，此文件主要作用是加载不同的页面资源以及管理一些全局配置。比如如果想替换导出页面发起请求的前缀，只需要修改 `AisudaPage.tsx` 文件中的 `AISUDA_HOST` 即可。
- `示例代码` 包含一个 `Jssdk.tsx` 文件，它本质是一个组件，可以把这个组件嵌入到业务系统中。

`示例代码`：
```tsx
/**
 * @file jssdkReactComp.tsx
 */

import * as React from 'react';
import {AisudaPage} from '@common/aisudaPage';

export default function TestComp() {
  const pageUrl = 'https://jssdk.bj.bcebos.com/jssdk/7ac8751b9a6c-3825510e/BzwQel2wM2-03a37ad3.js';
  const data = {customData: 'this is custom data'};

  return (
    <>
      <AisudaPage pageUrl={pageUrl} data={data} />
    </>
  );
}
```

`公共组件代码`：
```tsx
/**
 * @file common/aisudaPage.tsx
 */

import * as React from 'react';

interface AisudaPageProps {
  /**
   * 加载器 Url
   */
  loaderUrl: string;

  /** 页面 Url */
  pageUrl: string;

  data?: any;
}

export class AisudaPage extends React.Component<AisudaPageProps> {
  static defaultProps: Pick<AisudaPageProps, 'loaderUrl'> = {
    loaderUrl: 'https://jssdk.bj.bcebos.com/jssdk/loader-57e4a67d.js'
  };

  rootDom = React.createRef<HTMLDivElement>();
  unmounted = false;
  currentPage: any = null;

  componentDidMount() {
    this.unmounted = false;
    this.loadAMISLoader(this.props.loaderUrl, loader => {
      if (this.unmounted) {
        return;
      }

      loader.load(this.props.pageUrl, (page: any) => {
        const props = {
          // 数据
          data: this.props.data,
          // 权限
          perms: this.props.perms,
          // 替换请求域名
          AISUDA_HOST: 'http:/yourhost.com',
          // 全局环境变量
          consts: {}
        };
        this.currentPage = page;
        const env = {
            fetcher: loader.overriderFetcher()
        };
        this.rootDom.current &&
          !this.unmounted &&
          page.mount(this.rootDom.current, page.schema, props, env);
      });
    });
  }

  componentDidUpdate() {
    this.currentPage?.updateProps({
      data: this.props.data
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.currentPage?.unmount();
  }

  loadAMISLoader(url: string, callback?: (loader: any) => void) {
    if ((window as any).amisLoader) {
      callback?.((window as any).amisLoader);
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.onload = () => {
      callback?.((window as any).amisLoader);
    };
    script.setAttribute('src', url);

    document.body.appendChild(script);
  }

  render() {
    return <div ref={this.rootDom}>Loading...</div>;
  }
}

```

如何使用这两段代码可以参考本项目中 `src/components/AisudaPage.tsx` 文件，和 `src/route/Jssdk.tsx` 文件。

## 爱速搭平台接口说明

对于在爱速搭平台设计的普通页面，我们针对 `服务编排` 和 `数据模型` 等资源进行了特殊处理，可以通过业务方转发并重新签名的方式使用平台内部 `API` 。同时，我们会根据特定的路由规则，将 `API` 接口进行转换。

### 路由规则说明

`服务编排` 路由规则：
- 原路由规则：`api://${apiKey}`
- 转换后路由：`/api/company/${companyKey}/app/${appKey}/page/${pageId}/apicenterproxy/${apiKey}`

`数据模型(旧)` 路由规则：
- 原路由规则：`model://${Datasource}.${Table}`
- 转换后路由：`/api/resource/${companyKey}/${appKey}/page/${pageId}/${Datasource}.${Table}`

`数据模型(新)` 路由规则：
- 原路由规则：`model://${Datasource}.${Table}`
- 转换后路由：`/api/resource/${companyKey}/${appKey}/page/${pageId}/${Datasource}/${Table}`

`文件上传` 路由规则：
- 原路由规则：`object-upload://${key}`
- 转换后路由：`/api/company/${companyKey}/app/${appKey}/object-upload/${key}`

### 接口转发说明

在业务方需要转发上述接口到爱速搭平台，爱速搭平台提供了一套访问平台内部 `API` 的鉴权方案。这里以 `node` 为列说明。

爱速搭平台配置：配置环境变量：`ISUDA_INTERNAL_API_KEY: 'aisuda'`，这里 `aisuda` 为爱速搭平台内部鉴权密钥，可以自定义。

业务方代码示例：核心思路是使用 `jwt` 生成鉴权信息，然后带上鉴权信息转发到爱速搭平台。
```js
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { Controller, Get, Post } from "../decorator/Controller";

const PRIVATE_KEY = 'aisuda'

// API 编排转发示例
@Controller("api/company/:companyKey/app/:appKey/page/:pageId/apicenterproxy/:apiKey") // 这里是注册路由
export class ApiProxyController {
  @Post()
  async apiProxy(req: Request, res: Response, next: NextFunction) {
    const token = jwt.sign(
      { 
        email: "user@baidu.com" // 必须确保这个用户在爱速搭平台存在
      }, 
      PRIVATE_KEY, // 这里的 key 必须和爱速搭平台配置的 ISUDA_INTERNAL_API_KEY 一致
      {
        algorithm: "HS256", // 加密方式
      }
    );
    const { companyKey, appKey, pageId, apiKey } = req.params; // 从路由中把这些参数解析出来
    const host = ''; // 平台域名，这里需要替换成自己的
    const url = `${host}/api/company/${companyKey}/app/${appKey}/page/${pageId}/apicenterproxy/${apiKey}`
    const data = {}; // 请求参数，如果有的话需要传
    const options = {
      headers: {
        "X-Authorization": "Bearer " + token, // 带上鉴权信息，用于爱速搭平台内部鉴权
      }
    }
    const result = await axios.post(url, data, options); // axios 用于发送请求到爱速搭平台后端服务

    res.send(result.data);
  }
}

// 新版数据模型转发示例
@Controller("api/resource/:companyKey/:appKey/page/:pageId/:modelKey")
export class ModelController {
  // 列表接口
  @Get()
  async get(req: Request, res: Response) {
    const token = jwt.sign({ email: "yupeng12@baidu.com" }, PRIVATE_KEY, {
      algorithm: "HS256",
    });
    const { companyKey, appKey, pageId, modelKey } = req.params;
    const [ds, model] = modelKey.split(".");
    const query = qs.stringify(req.query as any);
    const host = ""; // 平台域名，这里需要替换成自己的
    const url = `${host}/api/resource/${companyKey}/${appKey}/page/${pageId}/${ds}/${model}?${query}`;
    const options = {
      headers: {
        "X-Authorization": "Bearer " + token, // 带上鉴权信息，用于爱速搭平台内部鉴权
      },
    };
    const result = await axios.get(url, options);

    res.send(result.data);
  }

  // 新增数据接口
  @Post()
  async test(req: Request, res: Response) {
    const token = jwt.sign({ email: "yupeng12@baidu.com" }, PRIVATE_KEY, {
      algorithm: "HS256",
    });
    const { companyKey, appKey, pageId, modelKey } = req.params;
    const [ds, model] = modelKey.split(".");
    const host = ""; // 平台域名，这里需要替换成自己的
    const url = `${host}/api/resource/${companyKey}/${appKey}/page/${pageId}/${ds}/${model}`;
    const options = {
      headers: {
        "X-Authorization": "Bearer " + token, // 带上鉴权信息，用于爱速搭平台内部鉴权
      },
    };
    const result = await axios.post(url, req.body, options);

    res.send(result.data);
  }
}
```

## 其他说明

### Jssdk 导出通知

爱速搭平台提供了一个通知功能，您可以在爱速搭的 `API中心` 新增一个接口，然后在 `应用设置/接口` 中配置 `jssdk 通知接口`，配置之后，当您导出页面之后，点击 `发送消息通知` ，我们会将您当前导出的页面信息发送给您配置的接口。

请求参数说明：

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| loader | string | 页面 url |
| page | string | 加载器 url |
| pageHashId | string | 页面 hash id |
| pageKey | string | 页面 key |
| pagePath | string | 页面 path |
| pageInfo | object | 页面信息 ```{"key": "页面 key", "title": "页面名称", "menuName": "菜单名称"}``` |
