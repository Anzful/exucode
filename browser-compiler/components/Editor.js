import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Map of language identifiers for Monaco Editor
const languageMap = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
};

const EditorComponent = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [worker, setWorker] = useState(null);
  const editorRef = useRef(null);

  // Initialize the worker only on the client side
  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== 'undefined') {
      const newWorker = new Worker('/worker.js');
      setWorker(newWorker);

      // Handle messages from the worker
      newWorker.onmessage = (event) => {
        if (event.data.error) {
          setOutput(`Error: ${event.data.error}`);
        } else {
          setOutput(event.data.output);
        }
      };

      // Cleanup the worker when the component unmounts
      return () => {
        newWorker.terminate();
      };
    }
  }, []);

  // Update code state when editor content changes
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Handle "Run" button click
  const handleRun = () => {
    if (language === 'javascript') {
      if (worker) {
        setOutput('Running...');
        worker.postMessage(code);
      } else {
        setOutput('Worker not initialized yet');
      }
    } else {
      setOutput('Execution only supported for JavaScript');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header with language selection and Run button */}
      <div className="flex justify-between p-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button
          onClick={handleRun}
          className="bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          Run
        </button>
      </div>
      {/* Split-screen layout for editor and output */}
      <div className="flex flex-1">
        {/* Monaco Editor */}
        <div className="w-1/2 p-4 border-r border-gray-700">
          <Editor
            height="100%"
            language={languageMap[language]}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        {/* Output Console */}
        <div className="w-1/2 p-4 bg-gray-800 overflow-auto">
          <pre className="text-white">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default EditorComponent;