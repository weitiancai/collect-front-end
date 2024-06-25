import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Button, Pagination,Modal } from 'antd';
import axios from './myAxios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';


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
  const [error, setError] = useState<string | null>(null); // 添加一个新的状态来保存错误信息

  interface APIResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  }

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`menu/select?title=${search}&pageNum=${current}&pageSize=${pageSize}`);
      const { records, total } = response.data;
      setData(records);
      setTotal(total);
      setError(null); // 请求成功,清除错误信息
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError; // 类型断言
        if (axiosError.response) {
          const responseData = axiosError.response.data as APIResponse; // 类型断言
          if (responseData.status === 401) {
            setError('错误提示：没有授权'); // 如果服务器返回的状态码是401，设置错误信息为"没有授权"
          } else {
            setError('错误提示：查询失败'); // 如果服务器返回的状态码是其他值，设置错误信息为"查询失败"
          }
        }
      }
      else {
        setError('未知错误');
      }
    }
  }, [search, current, pageSize]);




  const navigate = useNavigate();
  const handleLogout = () => { // 创建一个新的函数来处理退出登录的逻辑
    localStorage.removeItem('wmg-token'); // 清除localStorage中的token
    navigate('/'); // 跳转到根路由
  };


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div>
      {error && (
        <Modal
          title="错误提示"
          visible={!!error}
          onOk={() => setError(null)}
          onCancel={() => setError(null)}
          okText="确定"
          cancelText="取消"
        >
          <p>{error}</p>
        </Modal>
      )}
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
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default App;