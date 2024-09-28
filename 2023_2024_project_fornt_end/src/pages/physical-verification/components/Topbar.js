import { useState } from 'react'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import SingleVerify from './SingleVerify'
import BulkVerify from './BulkVerify'

const Topbar = () => {

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='1' label='Single Verification' />
        <Tab value='2' label='Bulk Verification' />
        <Tab value='3' label='View Final Verification' />
      </TabList>
      <TabPanel value='1'>
          <SingleVerify/>
      </TabPanel>
      <TabPanel value='2'>
         <BulkVerify status={0}/>
      </TabPanel>
      <TabPanel value='3'>
      <BulkVerify status={1}/>
      </TabPanel>
    </TabContext>
  )
}

export default Topbar