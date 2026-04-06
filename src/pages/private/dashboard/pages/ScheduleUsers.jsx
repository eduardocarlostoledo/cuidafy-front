import React, { useEffect, useState } from 'react'
import clienteAxios from '../../../../config/axios';
import TableSchedule from '../components/TableSchedule';

const ScheduleUsers = () => {
  return (
    <div>
      <TableSchedule />
    </div>
  );
}

export default ScheduleUsers