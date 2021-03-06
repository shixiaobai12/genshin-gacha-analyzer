/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { SCHEMA, SCHEMA_ALL, SHOW_DATA_ALL_KEY } from 'const';
import { WorkSheet } from 'components/WorkSheet';
import { Filter } from './Filter';

type ShowDataProps = {
  onGetData: (key: string) => any;
  tabs: Array<string>;
};
const { TabPane } = Tabs;

export const ShowData: FC<ShowDataProps> = function ({ onGetData, tabs }) {
  const [activeKey, setActiveKey] = useState(tabs[0]);
  const handleChange = useCallback((key) => {
    setActiveKey(key);
  }, []);
  // filter为函数，因此不能直接使用useState，为了页面能更新，不使用ref
  const [filter, setFilter] = useState<{
    current: any;
  }>({
    current: void 0,
  });
  const handleFilterChange = useCallback((filter) => {
    setFilter({
      current: filter,
    });
  }, []);
  const data = useMemo(() => {
    const data = onGetData(activeKey);
    if (!filter.current) return data;
    return data.filter(filter.current);
  }, [filter.current, activeKey]);
  return (
    <div
      css={css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        size='large'
        centered
        css={css`
          .ant-tabs-nav {
            background: #fff;
            height: 64px;
          }
        `}
      >
        {tabs.map((name: string) => (
          <TabPane tab={name} key={name} />
        ))}
        <TabPane tab={SHOW_DATA_ALL_KEY} key={SHOW_DATA_ALL_KEY} />
        <Filter onChange={handleFilterChange} activeKey={activeKey} />
      </Tabs>
      <WorkSheet data={data} schema={activeKey === SHOW_DATA_ALL_KEY ? SCHEMA_ALL : SCHEMA} />
    </div>
  );
};
