import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Spin, Row, Col, Card, Collapse, Checkbox, Divider, Tag } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const categories = [
  { value: '36kr', label: '36氪' },
  { value: '21jingji', label: '21经济网' },
  { value: 'tmtpost', label: '钛媒体' },
  { value: 'doit', label: 'DOIT' },
  { value: 'zhitongcaijing', label: '智通财经' },
  { value: 'thepaper', label: '澎湃' },
  { value: 'kankan', label: '看看新闻' },
  { value: 'yicai', label: '第一财经' },
  { value: 'stdaily', label: '中国科技网' },
  { value: 'm21caijing', label: '21财经' },
  { value: 'sseinfo', label: '上证e互动' },
  { value: 'bloomberg', label: 'bloomberg' },
];

const customCollapseStyle = {
  width: '150px',
  marginLeft: '35px',
};

const customPanelStyle = {
  // background: 'white',
  background: '#f0f2f5',
  borderRadius: 4,
  border: 0,
};

// const plainOptions = ['36氪', '钛媒体'];
const defaultCheckedList = ['36kr'];

@connect(
  state => ({
    news: state.news.news,
    loading: state.loading,
  }),
  {
    fetch: payload => ({
      type: 'news/fetch',
      payload,
    }),
  },
)
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
    };
  }

  componentDidMount() {
    this.props.fetch({
      category: ['36kr'],
      skip: 15,
    });
  }

  onChange = checkedList => {
    this.setState(
      {
        checkedList,
        indeterminate: !!checkedList.length && checkedList.length < categories.length,
        checkAll: checkedList.length === categories.length,
      },
      () => {
        this.props.fetch({
          category: this.state.checkedList,
          skip: 15,
        });
      },
    );
  };

  onCheckAllChange = e => {
    this.setState(
      {
        checkedList: e.target.checked ? categories.map(value => value.value) : [],
        indeterminate: false,
        checkAll: e.target.checked,
      },
      () => {
        this.props.fetch({
          category: this.state.checkedList,
          skip: 15,
        });
      },
    );
  };

  formatTime = timestamp => {
    const formatted = moment(timestamp).format('hh:mm');
    return formatted;
  };

  formatSource = source => {
    const filtered = categories.filter(obj => {
      if (obj.value === source) {
        return obj.label;
      }
      return null;
    });
    if (filtered) {
      return filtered[0].label;
    }
    return null;
  };

  render() {
    return (
      <PageHeaderWrapper>
        <Row>
          {/* 新闻展示区域 */}
          <Col span={20}>
            <Spin spinning={this.props.loading.models.news} size="large">
              <Card>
                <ul className={styles.items}>
                  {this.props.news.map(data => (
                    <li className={styles.item} key={data.href}>
                      <div className={styles.inner}>
                        <time className={styles.time}>{this.formatTime(data.ts_crawl)}</time>
                        <header className={styles.title}>
                          <a href={data.href} target="_blank" rel="noopener noreferrer">
                            {data.title}
                          </a>
                        </header>
                        <pre className={styles.summary}>{data.content}</pre>

                        <Tag visible={data.source}>{this.formatSource(data.source)}</Tag>
                        <i className={styles.dot} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </Spin>
          </Col>
          {/* 右侧筛选 */}
          <Col span={4}>
            <Collapse bordered={false} style={customCollapseStyle} defaultActiveKey={['1']}>
              <Panel header="筛选" style={customPanelStyle} key="1">
                <div>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox>
                  <Divider />
                  <CheckboxGroup
                    options={categories}
                    value={this.state.checkedList}
                    onChange={this.onChange}
                  />
                </div>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default News;
