/**
 * @file i18n.ts 
 *
 * @created: 2023/12/22
 */

import React from "react";


export const DEFAULT_LOCALE = "zh-CN";
export const I18nContext = React.createContext({locale: DEFAULT_LOCALE});