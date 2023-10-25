import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import './Home.css'; // Import your CSS file for styling

const Home = () => {
    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const getdata = async () => {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        setData(response.data);
    }

    const handleNext = () => {
        if (page === pageCount) return page;
        setPage(page + 1);
    }

    const handlePrevious = () => {
        if (page === 1) return page;
        setPage(page - 1);
    }

    const onChangeCheckBoxEvent = (e, index) => {
        let res = [...pageData];
        res[index].completed = e.target.checked;
        setPageData(res);
    }

    useEffect(() => {
        getdata()
    }, [page]);

    useEffect(() => {
        const pagedatacount = Math.ceil(data.length / 10);
        setPageCount(pagedatacount);

        if (page) {
            const LIMIT = 10;
            const skip = LIMIT * page;
            const dataskip = data.slice(page === 1 ? 0 : skip - LIMIT, skip);
            setPageData(dataskip);
        }
    }, [data, page]);

    return (
        <>
            <div className="container">
                <h1>User Data</h1>
                <div className='table_div mt-3'>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>userId</th>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pageData.length > 0 ?
                                    pageData.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{element.userId}</td>
                                                <td>{element.id}</td>
                                                <td className={element.completed ? 'completed' : ''}>{element.title}</td>
                                                <td>
                                                    <input type="checkbox" checked={element.completed} onChange={(e) => onChangeCheckBoxEvent(e, index)} />
                                                </td>
                                            </tr>
                                        )
                                    }) :
                                    <div className='d-flex justify-content-center mt-4'>
                                        Loading ....<Spinner animation="border" variant='danger' />;
                                    </div>
                            }
                        </tbody>
                    </Table>
                </div>
                <div className='d-flex justify-content-end'>
                    <Pagination>
                        <Pagination.Prev onClick={handlePrevious} disabled={page === 1} />
                        {Array(pageCount).fill(null).map((ele, index) => {
                            return (
                                <Pagination.Item
                                    key={index}
                                    active={page === index + 1 ? true : false}
                                    onClick={() => setPage(index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            )
                        })}
                        <Pagination.Next onClick={handleNext} disabled={page === pageCount} />
                    </Pagination>
                </div>
            </div>
        </>
    )
}

export default Home;
