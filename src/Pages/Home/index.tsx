import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Button, Pagination, Modal, Form, InputNumber } from 'antd';
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
  fsize: number | null;
}



const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<DataType | null>(null);

  interface APIResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
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
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: DataType) => (
        <span>
          <Button onClick={() => handleUpdate(record)}>Update</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];
  const handleUpdate = async (record: DataType) => {
    setEditData(record);
  };

  const localUrl = 'http://localhost:8081/api/';
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(localUrl + `select?title=${search}&pageNum=${current}&pageSize=${pageSize}`);
      const { records, total } = response.data;
      setData(records);
      setTotal(total);
      setError(null);
    } catch (error) {
      handleError(error);
    }
  }, [search, current, pageSize]);

  const handleError = (error: any) => {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const responseData = axiosError.response.data as APIResponse;
        if (responseData.status === 401) {
          setError('错误提示：没有授权');
        } if (responseData.status === 403) {
          setError('错误提示：没有授权');
        } else {
          setError('错误提示：查询失败');
        }
      }
    } else {
      setError('未知错误' + error);
    }
  }

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('wmg-token');
    navigate('/');
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = { ...editData, ...values };
      await axios.post(localUrl + 'edit', updatedData);
      fetchData();
      setEditData(null);
    } catch (error) {
      handleError(error);
      setError('更新失败或无权限');
    }
  };

  const handleEditCancel = () => {
    setEditData(null);
  };


  const handleDelete = async (id: number) => {
    try {
      await axios.get(localUrl + 'delete', { params: { id } });
      fetchData();
    } catch (error) {
      setError('删除失败或无权限');
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [form] = Form.useForm();
  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      <Modal
        title="Edit Data"
        visible={!!editData}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} initialValues={editData ? editData : {}} layout="vertical">
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="size" label="Size">
            <Input />
          </Form.Item>
          <Form.Item name="time" label="Time">
            <Input />
          </Form.Item>
          <Form.Item name="path" label="Path">
            <Input />
          </Form.Item>
          <Form.Item name="tag" label="Tag">
            <Input />
          </Form.Item>
          <Form.Item name="fsize" label="FSize">
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
      <Input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
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
