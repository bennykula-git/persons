import './App.css';
import MaterialTable from 'material-table';
import { useState, useEffect } from 'react';

const columns = [
  { title: 'Id', field: 'id', editable: 'never' },
  { title: 'First Name', field: 'firstName' },
  { title: 'Last Name', field: 'lastName' },
  { title: 'Email', field: 'email' },
  { title: 'Phone', field: 'phone' },
];

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // alert('loaded');
    loadDataFromServer();
  }, []);

  const loadDataFromServer = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/persons');
      if (!response.ok) {
        throw new Error('Unable to rerieve data');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const updateData = async (newData, oldData) => {
    try {
      const response = await fetch('http://localhost:8080/api/persons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error('Unable to update row');
      }
      const dataUpdate = [...data];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setData([...dataUpdate]);
    } catch (error) {
      alert(error.message);
    }
  };

  const addData = async (newData) => {
    try {
      const response = await fetch('http://localhost:8080/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error('Unable to add new row');
      }
      const id = await response.json();
      newData.id = id;
      setData([...data, newData]);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteRow = async (rowData) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/persons?id=' + rowData.id,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete person ' + rowData.id);
      }
      const rowId = rowData.tableData.id;
      const newData = [...data];
      newData.splice(rowId, 1);
      setData(newData);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <MaterialTable
      title='Basic Search Previewff'
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              // setData([...data, newData]);
              addData(newData);
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              updateData(newData, oldData);
              resolve();
            }, 1000);
          }),
        onRowDelete: (rowData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              deleteRow(rowData);
              resolve();
            }, 1000);
          }),
      }}
      options={{
        actionsColumnIndex: -1,
        search: true,
        addRowPosition: 'first',
      }}
      // actions={[
      //   {
      //     icon: 'delete',
      //     tooltip: 'Delete User',
      //     onClick: (event, rowData) => {
      //       confirmDelete(rowData);
      //     },
      //   },
      // ]}
    />
  );
}

export default App;
