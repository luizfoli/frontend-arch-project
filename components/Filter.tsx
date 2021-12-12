import type { NextPage } from 'next'
import { useState } from 'react';

const Filter: NextPage = () => {

  const [showFilters, setShowFilters] = useState(false);



  return (
    <div className="container-filter">
      <div className="title">
        <span>Tasks</span>
        <img src="filter.svg" onClick={() => setShowFilters(!showFilters)} />
        <form>
          <div>
            <label>Data prevista de conclusão de: </label>
            <input type="date" />
          </div>
          <div>
            <label>Até: </label>
            <input type="date" />
          </div>
          <div className="line"></div>
          <div>
            <label>Status: </label>
            <select>
              <option value={0}>Todas</option>
              <option value={1}>Ativas</option>
              <option value={2}>Concluidas</option>
            </select>
          </div>
        </form>
      </div>
      {showFilters && 
      <div className="filterMobile">
          <form>
              <div>
                <label>Periodo de: </label>
                <input type="date" />
              </div>
              <div>
                <label>Periodo até: </label>
                <input type="date" />
              </div>
              <div className="line"></div>
              <div>
                <label>Status: </label>
                <select>
                  <option value={0}>Todas</option>
                  <option value={1}>Ativas</option>
                  <option value={2}>Concluidas</option>
                </select>
              </div>
            </form>
        </div>
      }
    </div> 
  )
}

export default Filter;


