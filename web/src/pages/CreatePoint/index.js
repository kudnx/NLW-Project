import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker} from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'

import './styles.css'
import logo from '../../assets/logo.svg'

//sempre que se cria um estado para um array ou objeto, devemos informar o tipo da variavel que o array terá

const CreatePoint = () => {
  const [items, setItems] = useState([])
  const [ufs, setUfs] = useState([])
  const [cities, setCities] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whattsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedPosition, setSelectedPosition] = useState([0, 0])
  const [initialPosition, setinitialPosition] = useState([0, 0])

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude} = position.coords;
      setinitialPosition(
        [latitude, longitude]
      )
      setSelectedPosition(
        [latitude, longitude]
      )
    })
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla)

      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome)

      setCities(cityNames)
    })
  }, [selectedUf])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    }
    else{
      setSelectedItems([ ...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whattsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const data = {
      name,
      email,
      whattsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    console.log(data)
    api.post('points', data)

    alert('Ponto de coleta criado')
    await history.push('/')
  }

  return (
    <div id='page-create-point'>
      <header>
        <img src={ logo } alt="coleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a página Inicial
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do Ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
            ></input>
          </div>
        </fieldset>

        <div className="field-group">
          <div className="field">
            <label htmlFor="name">E-mail</label>
            <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
            ></input>
          </div>

          <div className="field">
            <label htmlFor="whattsapp">Whattsapp</label>
            <input
                type="text"
                name="whattsapp"
                id="whattsapp"
                onChange={handleInputChange}
            ></input>
          </div>
        </div>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={ initialPosition } zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Selecione um Estado</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint
