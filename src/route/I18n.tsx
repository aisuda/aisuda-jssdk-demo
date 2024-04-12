/**
 * @file jssdkReactComp.tsx
 *
 */

import React from "react";
import {AisudaPage} from '../components/AisudaPage';

export default function TestComp() {
  const pageUrl = 'https://yupeng.bj.bcebos.com/jssdk/7ac8751b9a6c-3825510e/dAE5vlbZ59-b3cc20bb.js';
  const data = {customData: 'this is custom data'};

  return (
    <>
      <AisudaPage pageUrl={pageUrl} data={data} />
    </>
  );
}
