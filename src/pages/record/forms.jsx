import React, { Component } from 'react';
import { Form, Modal, Select, DatePicker, Input, Button, Row, Col } from 'antd';
import styles from './index.less';
import moment from 'moment';

const authors = ['理事长', '院长', '秘书长'];
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const NewRecordForm = Form.create({ name: 'form_new_record' })(
  class RecordForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        newEvent: '',
      };
    }

    onAddEvent = e => {
      console.log(e);
    };

    render() {
      const { visible, onCancel, onCreate, form, events } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal visible={visible} title="新增记录" okText="提交" onCancel={onCancel} onOk={onCreate}>
          <Form layout="vertical">
            <Form.Item label="昵称" style={{ width: 240 }}>
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '请选择发表者' }],
              })(
                <Select>
                  {authors.map(item => (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="发表日期" style={{ width: 240 }}>
              {getFieldDecorator('pubDate', {
                rules: [{ required: true, message: '请选择发表时间' }],
              })(<DatePicker />)}
            </Form.Item>

            <Form.Item label="选择事件" style={{ width: 240 }}>
              {getFieldDecorator('event')(
                <Select>
                  {events.map(item => (
                    <Select.Option key={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="内容">
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入内容' }],
              })(<TextArea autoSize={{ minRows: 5 }} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

const NewEventForm = Form.create({ name: 'form_new_event' })(
  class EventForm extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form onSubmit={onCreate}>
          <Form.Item label="新增事件">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('event', {
                  rules: [{ required: true, message: '请输入需要新增的事件' }],
                })(<Input />)}
              </Col>
              <Col span={8}>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      );
    }
  },
);

const DeleteEventForm = Form.create({ name: 'form_del_event' })(
  class DeleteForm extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { onDelete, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form onSubmit={onDelete}>
          <Form.Item label="删除事件">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('eventDelete', {
                  rules: [{ required: true, message: '请先选择要删除的事件' }],
                })(
                  <Select>
                    {this.props.events.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>
              <Col span={8}>
                <Button type="danger" htmlType="submit">
                  删除
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      );
    }
  },
);

const RecordFilterForm = Form.create({ name: 'form_filter' })(
  class FilterForm extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { onFilter, form, events } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form layout="inline" onSubmit={onFilter}>
          <Form.Item>{getFieldDecorator('pubDateRange')(<RangePicker />)}</Form.Item>
          <Form.Item>
            {getFieldDecorator('nickname', {
              rules: [{ required: false, message: '请选择发表者' }],
            })(
              <Select style={{ width: 180 }}>
                {authors.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('event')(
              <Select style={{ width: 180 }}>
                {events.map(item => (
                  <Select.Option key={item.value}>{item.label}</Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
          </Form.Item>
        </Form>
      );
    }
  },
);

export { NewRecordForm, NewEventForm, DeleteEventForm, RecordFilterForm };
