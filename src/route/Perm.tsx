/**
 * @file jssdkReactComp.tsx
 *
 */

import * as React from "react";
import {Button} from 'antd';
import { AisudaPage } from "../components/AisudaPage";
export default function PermComp() {
  const pageUrl =
    "https://jssdk.bj.bcebos.com/files/25d5def49865-f958a2b0/DNoRLr7E3l-076bce99.js";
  const data = { customData: "this is custom data" };
  // 模拟权限，具体的权限可以从爱速搭平台获取
  const perms = ["page:DNoRLr7E3l:text1", "page:DNoRLr7E3l:text2"].filter(() => Math.random() > 0.5);

  return (
    <div>
      当前权限: {perms.join(",")}
      <AisudaPage pageUrl={pageUrl} data={data} perms={perms} />
    </div>
  );
}
