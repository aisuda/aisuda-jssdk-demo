/**
 * @file common/aisudaPage.tsx
 */

import * as React from 'react';
import { I18nContext } from '../context/i18n';

interface AisudaPageProps {
  /** 加载器 Url */
  loaderUrl: string;

  /** 页面 Url */
  pageUrl: string;

  /** 页面 数据 */
  data?: any;

  /** 权限 */
  perms?: string[];
}

export class AisudaPage extends React.Component<AisudaPageProps> {
  static defaultProps: Pick<AisudaPageProps, 'loaderUrl'> = {
    loaderUrl: 'https://jssdk.bj.bcebos.com/files/loader-cb798bd3.js'
  };
  static contextType = I18nContext;
  context!: React.ContextType<typeof I18nContext>;

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
          AISUDA_HOST: 'http://127.0.0.1:3000',
          // 全局环境变量
          consts: {},
          locale: this.context.locale
        };
        this.currentPage = page;
        this.rootDom.current &&
          !this.unmounted &&
          page.mount(this.rootDom.current, page.schema, props);
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
