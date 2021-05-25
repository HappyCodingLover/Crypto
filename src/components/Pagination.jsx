import React from 'react'
import ArrowPagination from '../images/icons/arrow-pagination.svg'

export default function Pagination(props) {
  return (
    <div className="pagination">
      {props.numberPagination !== 1 && (
        <React.Fragment>
          <button
            className="arrow mr rotate"
            onClick={() => props.setNumberPagination(props.numberPagination - 1)}>
            <ArrowPagination />
          </button>
          <button
            className="number"
            onClick={() => props.setNumberPagination(props.numberPagination - 1)}>
            {props.numberPagination - 1}
          </button>
        </React.Fragment>
      )}
      <button
        className="number active"
        onClick={() => props.setNumberPagination(props.numberPagination + 1)}
        disabled>
        {props.numberPagination}
      </button>
      {props.numberPagination + 1 <= props.filteredQuantityGrids && (
        <button
          className="number"
          onClick={() => props.setNumberPagination(props.numberPagination + 1)}>
          {props.numberPagination + 1}
        </button>
      )}
      {props.numberPagination === 1 && (
        <React.Fragment>
          {props.filteredQuantityGrids > 3 && (
            <button
              className="number"
              onClick={() => props.setNumberPagination(props.numberPagination + 2)}>
              {props.numberPagination + 2}
            </button>
          )}
          {props.filteredQuantityGrids > 4 && (
            <button
              className="number"
              onClick={() => props.setNumberPagination(props.numberPagination + 3)}>
              {props.numberPagination + 3}
            </button>
          )}
        </React.Fragment>
      )}
      {props.filteredQuantityGrids > 3 &&
        props.numberPagination + 1 <= props.filteredQuantityGrids && (
          <button
            className="arrow ml"
            onClick={() => props.setNumberPagination(props.numberPagination + 1)}>
            <ArrowPagination />
          </button>
        )}
    </div>
  )
}
