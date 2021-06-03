import React from 'react';
import ViaCep from 'react-via-cep';

export default class Cep extends React.Component {

    render() {
        return (
            <ViaCep cep={this.state.cep} lazy>
                { ({ data, loading, error, fetch }) => {
                if (loading) {
                    return <p>loading...</p>
                }
                if (error) {
                    return <p>error</p>
                }
                if (data) {
                    return <div>
                    <p>
                        CEP: {data.cep} <br/>
                        CIDADE: {data.localidade} <br/>
                        UF: {data.uf} <br/>
                    </p>
                    </div>
                }
                return <div>
                    <input onChange={this.handleChangeCep} value={this.state.cep} placeholder="CEP" type="text"/>
                    <button onClick={fetch}>Pesquisar</button>
                </div>
                }}
            </ViaCep>
        )
    }
}