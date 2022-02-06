import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import httpClient from './lib/httpClient'
import Footer from './Footer'
import './App.css'

function Breeds() {
    const [data, setData] = useState([])
    const [image, setImage] = useState([])
    const [url, setUrl] = useState('')
    const [desc, setDesc] = useState('')
    const [name, setName] = useState('')
    let params = useParams()
    let breed_id = params.breedId

    const fetchData = async () => {
        try {
            const { data: response = [] } = await httpClient.get(
                `breeds/search?q=${breed_id}`
            )
            setData(response)

            const item = response && response[0]
            item?.reference_image_id && fetchImage(item.reference_image_id)
            setDesc(item.description)
            setName(item.name)
        } catch (error) {
            console.error(error.message)
        }
    }

    const fetchImage = async (image_id) => {
        try {
            const { data: response } = await httpClient.get(
                `images/${image_id}`
            )
            setImage(response)
            setUrl(response.url)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="App">
            <section className="profile">
                <h1>
                    <a href="../" title="Mix Cat, the source of cats">
                        Mix Cat
                    </a>
                </h1>
                <div className="image_desc">
                    <div className="image">
                        <img alt="" className="image_object" src={url}></img>
                    </div>

                    <div className="desc">
                        <h2>{name}</h2>
                        {desc}
                    </div>
                </div>
            </section>
            {/* {JSON.stringify(data, null, '\t')} */}
            <section className="json">
                <h3>Breeds API Results</h3>
                <JSONPretty id="json-pretty" data={data}></JSONPretty>
                <hr></hr>
                <h3>Image API Results</h3>
                <JSONPretty id="json-pretty" data={image}></JSONPretty>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default Breeds
