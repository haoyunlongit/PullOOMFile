import { Button, DatePicker, Form, Input, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

const ConfigForm = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    // 设置默认的 token，实际使用时应该通过登录获取
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Inl1bmxvbmcyMCIsImV4cCI6MTczNTcxMDA5N30.f6XAJ6Jcjfx_VVMD0nP30eDNymLFfQJZrSSpXGSkA5g';
    localStorage.setItem('Admin-Token', token);
  }, []);

  const onFinish = async (values) => {
    try {
      const params = {
        biz_id: 34,
        data: JSON.stringify({
          biz: "architecture",
          file_path: values.filePath
        }),
        platform: ["android"],
        uid_reg: values.uid,
        version: JSON.stringify({
          type: "1",
          val: values.version
        }),
        android: JSON.stringify({
          wm: "",
          os_version: {
            type: "1",
            val: ""
          },
          device: ""
        }),
        expiration_time: values.expirationTime.valueOf() // 转换为时间戳
      };

      const response = await axios({
        method: 'get',
        url: '/ConfigOperation/configAdd',
        params: params,
        headers: {
          'Host': 'cfg.admin.lite.weibo.cn',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'accesstoken': localStorage.getItem('Admin-Token'),
          'Referer': 'http://cfg.admin.lite.weibo.cn/',
          'Accept-Language': 'zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7',
          'Cookie': `Admin-Token=${localStorage.getItem('Admin-Token')}; Admin-Name=yunlong20`
        },
        paramsSerializer: params => {
          const searchParams = new URLSearchParams();
          Object.keys(params).forEach(key => {
            if (Array.isArray(params[key])) {
              params[key].forEach(value => searchParams.append(`${key}[]`, value));
            } else {
              searchParams.append(key, params[key]);
            }
          });
          return searchParams.toString();
        }
      });

      console.log('Response:', response.data);

      if (response.status === 200) {
        message.success('配置添加成功');
        form.resetFields();
      } else {
        message.error(response.data.message || '配置添加失败');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('请求失败：' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
      initialValues={{
        uid: '7520254407',
        version: 'EC2',
        expirationTime: dayjs().add(2, 'day') // 默认两天后过期
      }}
    >
      <Form.Item
        label="文件路径"
        name="filePath"
        rules={[{ required: true, message: '请输入文件路径' }]}
      >
        <Input.TextArea
          placeholder="请输入本地文件路径，例如：/storage/emulated/0/Android/data/com.sina.weibo/files/..."
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        label="UID"
        name="uid"
        rules={[{ required: true, message: '请输入UID' }]}
      >
        <Input placeholder="请输入UID，例如：7520254407" />
      </Form.Item>

      <Form.Item
        label="版本"
        name="version"
        rules={[{ required: true, message: '请输入版本信息' }]}
      >
        <Input placeholder="请输入版本信息，例如：EC2" />
      </Form.Item>

      <Form.Item
        label="过期时间"
        name="expirationTime"
        rules={[{ required: true, message: '请选择过期时间' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择过期时间"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConfigForm; 