import React, { useEffect, useState,useCallback } from 'react';
import { Table, Input,Button, Pagination } from 'antd';
import axios from 'axios';

interface DataType {
  id: number;
  title: string;
  size: string;
  time: string;
  path: string;
  tag: string;
  fsize: string | null;
}

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
  },
  {
    title: 'FSize',
    dataIndex: 'fsize',
    key: 'fsize',
  },
];
const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    const response = await axios.get(`menu/select?title=${search}&pageNum=${current}&pageSize=${pageSize}`);
    setData(response.data.records);
    setTotal(response.data.total);
  }, [search, current, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div>
      <Input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} // 禁用内置的分页
      />
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={(page, pageSize) => {
          setCurrent(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
};

export default App;