import { render } from 'solid-js/web';
import { FileList } from './components/FileList';
import { UploadSection } from './components/UploadSection';
import { FileProvider } from './contexts/FileContext';
import './index.css';

function App() {
  return (
    <FileProvider>
      <div class="container">
        <h1 class="title">Cloud File Storage</h1>
        <UploadSection />
        <FileList />
      </div>
    </FileProvider>
  );
}

const container = document.getElementById('app');
if (container) {
  render(() => <App />, container);
}