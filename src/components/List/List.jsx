import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { Await } from 'react-router-dom'
import './List.css'
import Table from 'react-bootstrap/Table';
import { getList } from '../../services/ApiService.js'
import { ITEMS_PER_PAGE } from '../../../config.js';


export default function List() {

    const [filter, setFilter] = useState({});
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(ITEMS_PER_PAGE);
    const [offset, setOffcet] = useState(0);
    const [limit, setLimit] = useState(itemPerPage);
    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);


    function changeName(event) {
        let newFilter = {};
        Object.assign(newFilter, filter);
        newFilter["product"] = event.target.value.trim();
        setFilter(newFilter)
    }

    function changeBrand(event) {
        let newFilter = {};
        Object.assign(newFilter, filter);
        newFilter["brand"] = event.target.value.trim();
        setFilter(newFilter)
    }

    function changePrice(event) {
        let newFilter = {};
        Object.assign(newFilter, filter);
        newFilter["price"] = parseFloat(event.target.value);
        setFilter(newFilter)
    }

    function prevPage() {
        setOffcet(offset - itemPerPage)
        setPage(page - 1)
    }

    function nextPage() {
        setOffcet(offset + itemPerPage)
        setPage(page + 1)
    }

    function updatePrevNextButtons() {
        if (offset > 0) {
            setShowPrevButton(true);
        } else {
            setShowPrevButton(false);
        }
    }

    useEffect(() => {
        setList(getList(offset, limit, filter));
        updatePrevNextButtons();
    }, [offset, limit]);

    function search() {
        setOffcet(0)
        setPage(1)
        setList(getList(offset, limit, filter));
        updatePrevNextButtons();
    }

    return (
        <>
            <div className="filterRow">
                <div className="searchBox">
                    <label htmlFor="searchName">Название товара</label>
                    <input id='searchName' type="text" onChange={changeName} />
                </div>
                <div className="searchBox">
                    <label htmlFor="searchBrand">Название бренда</label>
                    <input id='searchBrand' type="text" onChange={changeBrand} />
                </div>
                <div className="searchBox">
                    <label htmlFor="searchPrice">Цена</label>
                    <input id='searchPrice' type="number" onChange={changePrice} />
                </div>
                <button className="searchButton" onClick={search}>
                    Поиск
                </button>
            </div>


            <div className="listContainer">

                <Suspense fallback={<h2>Загрузка...</h2>}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Название товара</th>
                                <th>Цена</th>
                                <th>Бренд</th>
                            </tr>
                        </thead>

                        <tbody>
                            <Await resolve={list}>
                                {
                                    (resolvedPosts) => (<>
                                        {
                                            resolvedPosts.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.product}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.brand}</td>
                                                </tr>
                                            ))
                                        }
                                    </>)
                                }
                            </Await>
                        </tbody>
                    </Table>

                </Suspense>

            </div >


            <div className="buttonСontainer">
                {showPrevButton &&
                    <button className="arrowButton" onClick={prevPage}>
                        <img src="arrow.svg" alt='Назад' className='arrowImg rotate180' />
                        Назад
                    </button>
                }

                <div className='currentPageNumber'>Текущая страница: {page}</div>

                {showNextButton &&
                    <button className="arrowButton" onClick={nextPage}>
                        Вперед
                        <img src="arrow.svg" alt='Вперед' className='arrowImg' />
                    </button>
                }
            </div>

        </>
    )
}
