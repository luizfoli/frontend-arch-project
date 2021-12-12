import type { NextPage } from 'next'
import moment from 'moment';
import { useEffect, useState } from 'react'

const Footer: NextPage = () => {


  return (
    <div className="container-footer">
      <button>+ Add a new task</button>
      <span>Copyright {moment().year()}. All rights.</span>
    </div>
  )
}

export default Footer


