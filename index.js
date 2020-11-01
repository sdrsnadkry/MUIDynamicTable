import React from 'react'
import DataTable from './DataTable'

/***
 * 1. DATAS SHOULD BE SENT IN PROPER FORMAT ***** NOT OBJECTS OR ARRAYS.
 * 2. datas WILL BE LIST OF ARRAYS FROM REDUX
 * 3. REDUCE datas IN PROPER FORMAT AT PARENT COMPONENT AND SEND TO TABLE (CHILD COMPONENT)
 */

const tableDatas = {
    tableTitle: "Office",
    fields: ['name', 'longitude', 'latitude', 'address'],
    datas: [
        { id: 1, name: 'aaa', longitude: '1234', latitude: '65913', address: 'ktm' },
        { id: 2, name: 'aaa', longitude: '12345', latitude: '65913', address: 'pkr' },
        { id: 3, name: 'aaa', longitude: '12346', latitude: '65913', address: 'nep' },
        { id: 4, name: 'aaa', longitude: '12347', latitude: '65913', address: 'ktm' },
        { id: 5, name: 'aaa', longitude: '12348', latitude: '65913', address: 'ddl' },
        { id: 6, name: 'aaa', longitude: '349', latitude: '65913', address: 'btd' },
    ]
}

const DynamicTableIndex = () => {
    return (
        <div className="main__container mt__4">
            <DataTable tableInfo={tableDatas} />
        </div>
    )
}

export default DynamicTableIndex
