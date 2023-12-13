/**
 * @file Model.tsx 
 *
 * @created: 2023/12/13
 */

import React from "react";
import {AisudaPage} from '../components/AisudaPage';

export default function Model() {
  const pageUrl = 'https://jssdk.bj.bcebos.com/jssdk/7ac8751b9a6c-3825510e/kQwM3JPZd2-c86bb0cb.js';
  const data = {customData: 'this is custom data'};

  return (
    <>
      <AisudaPage pageUrl={pageUrl} data={data} />
    </>
  );
}
