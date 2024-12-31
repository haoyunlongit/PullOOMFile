import { Layout } from 'antd';
import './App.css';
import ConfigForm from './components/ConfigForm';

const { Content } = Layout;

function App() {
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>配置添加</h1>
          <ConfigForm />
        </div>
      </Content>
    </Layout>
  );
}

export default App; 