import PropTypes from 'prop-types';

const Pagination = ({ pageData, handlePageChange }) => {
  
    return (
      <div className='d-flex justify-content-center mt-5'>
          <nav aria-label="Page navigation">
              <ul className="pagination">
                  <li className={`page-item ${!pageData?.has_pre && 'disabled'}`}>
                    <button type="button" onClick={() => handlePageChange(pageData?.current_page - 1)} className="page-link border-0" style={{backgroundColor:'#757371', color:'#ffffff'}}>上一頁</button>
                  </li>
                  {[...Array(pageData?.total_pages)].map((_, index) => (
                    <li key={index} className={`page-item ${pageData?.current_page === index + 1 ? "active" : ""}`}>
                      <button className="page-link border-0" style={{backgroundColor:'#757371'}} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
  
                  <li className={`page-item ${!pageData?.has_next && 'disabled'}`}>
                    <button type="button" onClick={() => handlePageChange(pageData.current_page + 1)} className="page-link border-0" style={{backgroundColor:'#757371', color:'#ffffff'}}>下一頁</button>
                  </li>
              </ul>
          </nav>
      </div>
    )
  }

  Pagination.propTypes = {
    pageData: PropTypes.shape({
      total_pages: PropTypes.number,
      current_page: PropTypes.number,
      has_pre: PropTypes.bool,
      has_next: PropTypes.bool,
    }).isRequired,
    handlePageChange: PropTypes.func.isRequired,
  };
  
  export default Pagination