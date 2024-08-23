import ReactDOM from 'react-dom/client';

import { App } from '~/app';
import '~/app/styles';

const root = document.getElementById('root');

ReactDOM.createRoot(root as HTMLElement).render(<App />);
