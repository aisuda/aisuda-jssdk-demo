/**
 * @file Jssdk.tsx 
 *
 * @created: 2023/12/13
 */
import React from "react";
import {AisudaPage} from '../components/AisudaPage';

function ApiCenter() {
  const pageUrl = 'https://yupeng.bj.bcebos.com/jssdk/7ac8751b9a6c-3825510e/vxo93yjEP1-6e376401.js';
  const data = {customData: 'this is custom data'};

  return (
    <>
      <AisudaPage pageUrl={pageUrl} data={data} />
    </>
  );
}

export default ApiCenter;
