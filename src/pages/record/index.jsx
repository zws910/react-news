import React, { Component } from 'react';
import {
  List,
  Icon,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  Modal,
  Form,
  Input,
  Divider,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import moment from 'moment';
import { NewRecordForm, NewEventForm, DeleteEventForm, RecordFilterForm } from './forms.jsx';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@connect(
  state => ({
    records: state.record.records,
    events: state.record.events,
    loading: state.loading,
  }),
  {
    fetch: payload => ({
      type: 'record/fetch',
      payload,
    }),
    fetchEvent: () => ({
      type: 'record/fetchEvent',
    }),
    addRecord: payload => ({
      type: 'record/postRecord',
      payload,
    }),
    addEvent: payload => ({
      type: 'record/postEvent',
      payload,
    }),
    delEvent: payload => ({
      type: 'record/deleteEvent',
      payload,
    }),
  },
)
class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      eventFormVisible: false,
      eventValue: '',
      loadLimit: 10,
      pubStartDate: '',
      pubEndDate: '',
      pubNickname: '',
    };
  }

  componentDidMount() {
    this.props.fetch({
      limit: this.state.loadLimit,
      startDate: this.state.pubStartDate,
      endDate: this.state.pubEndDate,
      pubNickname: this.state.pubNickname,
    });
    this.props.fetchEvent();
  }

  // 新增记录表单相关操作
  onAdd = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      this.setState({ visible: false });
      values.pubDate = moment(values.pubDate).format('YYYY-MM-DD');
      this.props.addRecord({
        record: values,
      });
    });
  };

  selectEditDate = (date, dateString) => {
    console.log(date, dateString);
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  saveFormAdd = formRef => {
    this.formAdd = formRef;
  };

  saveFormDel = formRef => {
    this.formDel = formRef;
  };

  saveFormFilter = formRef => {
    this.formFilter = formRef;
  };

  // 管理事件相关操作
  onEventManage = () => {
    this.setState({ eventFormVisible: true });
  };

  handleEventCancel = () => {
    const { form } = this.formAdd.props;
    this.setState({ eventFormVisible: false });
    form.resetFields();
  };

  handleEventInput = e => {
    this.setState({
      eventValue: e.target.value,
    });
  };

  confirmAddEvent = e => {
    const { form } = this.formAdd.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        this.props.addEvent({
          event: values.event,
        });
        this.props.fetchEvent();
        this.setState({ eventFormVisible: false });
      }
    });
    form.resetFields();
  };

  confirmDeleteEvent = e => {
    const { form } = this.formDel.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.props.delEvent({
          event: values.eventDelete,
        });
        this.props.fetchEvent();
        this.setState({ eventFormVisible: false });
      }
    });
    form.resetFields();
  };

  onLoadMore = () => {
    this.setState({
      loadLimit: this.state.loadLimit + 10,
    });
    this.props.fetch({
      limit: this.state.loadLimit,
    });
  };

  // 处理筛选
  filterRecord = e => {
    const { form } = this.formFilter.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let pubStartDate = '';
      let pubEndDate = '';

      if (values.pubDateRange) {
        let dateRange = [];
        values.pubDateRange.forEach(date => {
          dateRange.push(moment(date).format('YYYY-MM-DD'));
        });
        this.setState({
          pubStartDate: dateRange[0],
          pubEndDate: dateRange[1],
        });
        pubStartDate = dateRange[0];
        pubEndDate = dateRange[1];
      }

      if (values.nickname) {
        this.setState({
          pubNickname: values.nickname,
        });
      }

      this.props.fetch({
        limit: this.state.loadLimit,
        startDate: pubStartDate,
        endDate: pubEndDate,
        pubNickname: values.nickname,
        event: values.event,
      });
    });
  };

  render() {
    const { loading, list } = this.state;

    const loadMore = !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={this.onLoadMore}>加载更多</Button>
      </div>
    ) : null;

    return (
      <div>
        <Row>
          <Col span={6}>
            {/* 新增记录 */}
            <Button type="primary" style={{ marginLeft: '5px' }} icon="form" onClick={this.onAdd}>
              新增记录
            </Button>

            <NewRecordForm
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              events={this.props.events}
            />
            {/* 管理事件 */}
            <Button icon="edit" style={{ marginLeft: '5px' }} onClick={this.onEventManage}>
              管理事件
            </Button>
            <Modal
              title="管理事件"
              visible={this.state.eventFormVisible}
              onCancel={this.handleEventCancel}
              footer={null}
            >
              <NewEventForm
                wrappedComponentRef={this.saveFormAdd}
                onCreate={this.confirmAddEvent}
              />
              <DeleteEventForm
                wrappedComponentRef={this.saveFormDel}
                onDelete={this.confirmDeleteEvent}
                events={this.props.events}
              />
            </Modal>
          </Col>

          <Col span={18}>
            {/* 筛选栏 */}
            <RecordFilterForm
              wrappedComponentRef={this.saveFormFilter}
              onFilter={this.filterRecord}
              events={this.props.events}
            />
          </Col>
        </Row>
        <Row>
          <List
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={this.props.records}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.nickname}
                  description={
                    <p>
                      <span>{item.pubDate}</span> {item.event}
                    </p>
                  }
                />
                {item.content}
              </List.Item>
            )}
          />
        </Row>
      </div>
    );
  }
}

export default Record;
