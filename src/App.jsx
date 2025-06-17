import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, message, Form, Input, Alert } from 'antd';
import { usePosts, useDeletePosts, useUpdatePosts, useCreatePosts } from './hooks/usePosts';
import 'antd/dist/reset.css';

function App() {
  const { data: posts, isLoading, isError, error } = usePosts();
  const deletePost = useDeletePosts();
  const updatePost = useUpdatePosts();
  const createPost = useCreatePosts();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const showDeleteModal = (post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const showEditModal = (post) => {
    setSelectedPost(post);
    form.setFieldsValue({ title: post.title, body: post.body });
    setIsEditModalOpen(true);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(selectedPost.id);
      message.success('Post deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Failed to delete post');
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updatePost.mutateAsync({ id: selectedPost.id, values });
      message.success('Post updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Failed to update post');
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createPost.mutateAsync(values);
      message.success('Post created successfully');
      setIsCreateModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Failed to create post');
    }
  };

  const filteredposts = useMemo(() => {
    return (posts || []).filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.body.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [posts, searchText]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showEditModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => showDeleteModal(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Post Listing</h2>
      {isError && (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by title or body"
          allowClear
          enterButton="Search"
          onSearch={(value) => setSearchText(value)}
          style={{ maxWidth: 400 }}
        />
        <Button type="primary" onClick={showCreateModal}>
          Create New Post
        </Button>
      </div>

      <Table
        loading={isLoading}
        dataSource={filteredposts}
        rowKey="id"
        columns={columns}
      />

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this post titled "{selectedPost?.title}"?</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Post"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Body" name="body" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Create New Post"
        open={isCreateModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Body" name="body" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;


