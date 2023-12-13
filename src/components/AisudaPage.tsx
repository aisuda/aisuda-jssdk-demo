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
          // 替换请求域名
          AISUDA_HOST: 'http://127.0.0.1:3000',
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
    try {
      this.currentPage?.unmount();
    } catch (error) {
    }
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
