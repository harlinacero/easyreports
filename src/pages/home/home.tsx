import React, { useState, useRef, useCallback, useEffect } from 'react';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import CustomDataGrid from '../../components/datagrid';
import { Switch } from 'devextreme-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import './home.scss';

interface ApiResponse {
  data: string;
  strSql: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const formData = useRef({ query: '' });
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    Prism.highlightAll();
  }, [query]);
  
  const apiUrl = window._env_?.API_URL;
  
  const onSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // create service post to get data
    const url = `${apiUrl}/api/EasySQL`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ naturalQuery: formData.current.query })
      });
      if (!response.ok) {
        const errorData = await response.text();
        setError(errorData);
        throw new Error(errorData || 'Error al generar la consulta');
      }
      const result: ApiResponse = await response.json();
      setData(JSON.parse(result.data));
      setQuery(result.strSql);
      setError('');
      setLoading(false);
    } catch (error) {
      setData([]);
      setLoading(false);
      notify('La consulta no produjo resultados', 'error', 2000);
    }
  }, [apiUrl]);

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Diseñador de Reportes</h2>
      <form onSubmit={onSubmit}>
        <Form formData={formData.current} disabled={loading}>
          <Item
            dataField={'query'}
            editorType={'dxTextArea'}
            editorOptions={queryEditorOptions}
          >
            <RequiredRule message="La consulta es necesaria" />
            <Label visible={true}>Texto de la consulta</Label>
          </Item>

          <ButtonItem>
            <ButtonOptions
              width={'100%'}
              type={'default'}
              useSubmitBehavior={true}
            >
              <span className="dx-button-text">
                {
                  loading
                    ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                    : 'Consultar'
                }
              </span>
            </ButtonOptions>
          </ButtonItem>
        </Form>
      </form>

      <div className={'content-grid'}>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <CustomDataGrid data={data}></CustomDataGrid>
        )}
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Mostrar Query</div>
        <div className="dx-field-value">
          <Switch defaultValue={showQuery} onValueChange={setShowQuery} />
        </div>
      </div>
      {data && showQuery && (
        <div className={'content-bloc'}>
          <h4>Consulta generada</h4>
          <div className={'content-block'}>
            <pre>
              <code className={'language-sql'}>{query}</code>
            </pre>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

const queryEditorOptions = { stylingMode: 'outlined', labelMode: 'hidden', placeholder: 'Ingresa tu consulta', mode: 'text' };