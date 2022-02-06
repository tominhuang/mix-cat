import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import DataTable from './DataTable'
import httpClient from './lib/httpClient'
import Footer from './Footer'
import './App.css'

function App() {
    const initColumns = [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Life Span (year)',
            accessor: 'life_span',
        },
        // {
        //     Header: 'Weight Imperial (pound)',
        //     accessor: 'imperial',
        // },
        {
            Header: 'Weight (KG)', // 'Weight Metric (kilogram)',
            accessor: 'metric',
        },
        {
            Header: 'Profile',
            Cell: function renderDescription(row) {
                return (
                    <span
                        className="datatable_link"
                        dangerouslySetInnerHTML={{
                            __html: row.row.original.link,
                        }}
                    />
                )
            },
        },
    ]
    const [data, setData] = useState([])
    const [columns, setColumns] = useState(initColumns)
    const [displayImage, setDisplayImage] = useState(true)
    const [querying, setQuerying] = useState(true)
    const [q, setQ] = useState('')

    const tidyData = (response = []) => {
        const changedData = response.map((item) => {
            let bodyData = {
                name: item.name,
                life_span: item.life_span,
                // imperial: item.weight?.imperial || '',
                metric: item.weight?.metric || '',
                reference_image_id: item.reference_image_id || '',
                image: '',
            }

            if (displayImage) {
                bodyData.image = item.reference_image_id
                    ? `<img alt="" src="https://cdn2.thecatapi.com/images/${item.reference_image_id}.jpg"
                    onerror="this.src='https://cdn2.thecatapi.com/images/${item.reference_image_id}.png'" ></img>`
                    : 'N/A'
            }

            bodyData.link = `<a href="./breeds/${item.name}">View</a>`

            return bodyData
        })

        return changedData
    }

    const tidyColumns = () => {
        let columnsHeader = [...columns]
        if (displayImage && columnsHeader[0].Header !== 'Image') {
            columnsHeader.unshift({
                Header: 'Image',
                Cell: function renderDescription(row) {
                    return (
                        <span
                            className="datatable_image"
                            dangerouslySetInnerHTML={{
                                __html: row.row.original.image,
                            }}
                        />
                    )
                },
            })
        } else {
            columnsHeader = initColumns
        }
        return columnsHeader
    }

    const fetchData = async (keyword = '') => {
        const KEYWORD_LEN_THRESHOLD = 3
        const keywordLen = keyword.length
        if (!keyword || keywordLen < KEYWORD_LEN_THRESHOLD) {
            return
        }
        setQuerying(true)
        setQ(keyword)
        try {
            const { data: response } = await httpClient.get(
                `breeds/search?q=${keyword}`
            )
            let len = response.length
            if (len > 0) {
                const bodyData = tidyData(response)
                const columnsData = tidyColumns()
                setData(bodyData)
                setColumns(columnsData)
            } else {
                setData([])
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setQuerying(false)
        }
    }
    const debounceData = useCallback(_.debounce(fetchData, 1000), [])
    const search = (a) => {
        const keyword = a.target.value
        debounceData(keyword)
    }
    const showImage = () => {
        setDisplayImage(!displayImage)
    }

    useEffect(() => {
        const searchInput = document.getElementById('search')
        let urlParams = new URLSearchParams(window.location.search)
        let q = urlParams.get('q')
        searchInput.focus()
        setQuerying(false)
        if (q) {
            searchInput.value = q
            fetchData(q)
        }
    }, [])

    return (
        <div className="App">
            <section className="App-header">
                <h1>
                    <a href="./" title="Mix Cat, the source of cats">
                        Mix Cat
                    </a>
                </h1>
                <input
                    id="search"
                    type="input"
                    placeholder="Enter a keyword no less than 3 chars to search cat breed, like shorthair, Bengal, or Ragdoll"
                    className="search_input"
                    onKeyUp={search}
                ></input>
                {/* <div className="preference">
                    Search Image:
                    <input
                        type="checkbox"
                        onChange={showImage}
                        checked={displayImage}
                    ></input>
                    ({displayImage ? 'on' : 'off'})
                </div> */}
                <div className="tip">
                    Keywords: <a href="./?q=longhair">longhair</a>,{' '}
                    <a href="./?q=American">American</a>
                </div>
                <div className="cat_table">
                    {Object.keys(data).length > 0 ? (
                        <DataTable columns={columns} data={data}></DataTable>
                    ) : querying ? (
                        <span className="loading">Loading...</span>
                    ) : q ? (
                        <span className="not_found">Oops, not found!</span>
                    ) : null}

                    {/* {data.map((item) => (
                        <div>
                            {item.name}, {item.imperial}, {item.metric},{' '}
                            {item.life_span}
                        </div>
                    ))} */}
                </div>
            </section>

            <section className="main-card__bottom-section">
                <h2 className="main-card__additional">Popular Breeds</h2>
                <div className="main-card__cat-row">
                    <div className="main-card__cat-row-element">
                        <a href="./breeds/Toyger">
                            <div className="main-card__cat-row-wrapper">
                                <span className="main-card__cat-row-detail"></span>
                                <img
                                    alt=""
                                    src="https://cdn2.thecatapi.com/images/O3F3_S1XN.jpg"
                                    className="main-card__cat-row-image"
                                ></img>
                            </div>
                            <p className="main-card__cat-row-text">Toyger</p>
                        </a>
                    </div>
                    <div className="main-card__cat-row-element">
                        <a href="./breeds/Cheetoh">
                            <div className="main-card__cat-row-wrapper">
                                <span className="main-card__cat-row-detail"></span>
                                <img
                                    alt=""
                                    src="https://cdn2.thecatapi.com/images/IFXsxmXLm.jpg"
                                    className="main-card__cat-row-image"
                                ></img>
                            </div>
                            <p className="main-card__cat-row-text">Cheetoh</p>
                        </a>
                    </div>
                    <div className="main-card__cat-row-element">
                        <a href="./breeds/Chartreux">
                            <div className="main-card__cat-row-wrapper">
                                <span className="main-card__cat-row-detail"></span>
                                <img
                                    alt=""
                                    src="https://cdn2.thecatapi.com/images/j6oFGLpRG.jpg"
                                    className="main-card__cat-row-image"
                                ></img>
                            </div>
                            <p className="main-card__cat-row-text">Chartreux</p>
                        </a>
                    </div>
                    <div className="main-card__cat-row-element">
                        <a href="./breeds/Bengal">
                            <div className="main-card__cat-row-wrapper">
                                <span className="main-card__cat-row-detail"></span>
                                <img
                                    alt=""
                                    src="https://cdn2.thecatapi.com/images/O3btzLlsO.png"
                                    className="main-card__cat-row-image"
                                ></img>
                            </div>
                            <p className="main-card__cat-row-text">Bengal</p>
                        </a>
                    </div>
                </div>
            </section>

            <div className="feature">
                <h3>Feature Breeds</h3>
                <ul className="bread_list">
                    <li className="bread">
                        <a href="./breeds/Persian">Persian</a>
                    </li>
                    <li className="bread">
                        <a href="./breeds/Singapura">Singapura</a>
                    </li>
                    <li className="bread">
                        <a href="./breeds/Havana Brown">Havana Brown</a>
                    </li>
                    <li className="bread">
                        <a href="./breeds/Savannah">Savannah</a>
                    </li>
                    <li className="bread">
                        <a href="./breeds/Turkish Van">Turkish Van</a>
                    </li>
                </ul>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default App
