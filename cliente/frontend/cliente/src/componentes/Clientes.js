import React from 'react';
import Swal from 'sweetalert2';
import Tabela from './Tabela'
import Header from './Header';
import Adicionar from './Adicionar';
import Editar from './Editar';
import axios from 'axios';

export default class Clientes extends React.Component {
  constructor(props) {      
    super(props);
    this.state = {
        clientes: [],
        clienteSelecionado: {},
        estaAdicionando: false,
        estaEditando: false
    };

    this.getDados();
  }

  getDados = () => {
    let token = localStorage.getItem('token');
    axios.get('http://localhost:8080/clientes?token=' + token).then(res => {      
      console.log(res);      
      this.setState(state => ({
        clientes: res.data.dados
      }))
    })
  }

  handleEditar = id => {
      this.setState(state => ({
          clienteSelecionado: this.state.clientes.filter(cliente => cliente.id === id)[0],
          estaEditando: true
      }));
  }

  handleExcluir = id => {
    Swal.fire({
        icon: 'warning',
        title: 'Exclusão',
        text: "Você tem certeza que deseja excluir?",
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then(result => {
        if (result.value) {
          const [cliente] = this.state.clientes.filter(cliente => cliente.id === id);
  
          let token = localStorage.getItem('token');
          axios.delete('http://localhost:8080/clientes/' + 
            cliente.id + '?token=' + token).then(res => {
              if (res.data.erro) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erro!',
                  text: res.data.mensagem,
                  showConfirmButton: true,
                });  
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Excluído',
                  text: `${cliente.nome} foi excluído`,
                  showConfirmButton: false,
                  timer: 1500
                });

                this.getDados();
              }
            })
        }
      });
  }

  setEstaAdicionando = valor => {
      this.setState(state => ({
        estaAdicionando: valor  
      }));
  }

  setEstaEditando = valor => {
    this.setState(state => ({
        estaEditando: valor  
      }));
  }

  render() {
    return (
        <div className="container">
          {!this.state.estaAdicionando && !this.state.estaEditando && (
            <>              
              <Header
                setEstaAdicionando={this.setEstaAdicionando}
              />
              <Tabela
                clientes={this.state.clientes}
                editar={this.handleEditar}
                excluir={this.handleExcluir}
              />
            </>
          )}     
          {this.state.estaAdicionando && (
            <Adicionar             
              atualiza={this.getDados}
              setEstaAdicionando={this.setEstaAdicionando}
            />
          )}  
          {this.state.estaEditando && (
            <Editar 
            atualiza={this.getDados}
            cliente={this.state.clienteSelecionado}
            setEstaEditando={this.setEstaEditando}
            />
          )}   
        </div>
      );    
  }

}