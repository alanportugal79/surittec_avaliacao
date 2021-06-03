import React from 'react';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import validator from 'validator'

export default class Editar extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          nome: this.props.cliente.nome,
          cpf: this.props.cliente.cpf,
          cep: this.props.cliente.cep,
          logradouro: this.props.cliente.logradouro,
          complemento: this.props.cliente.complemento,
          bairro: this.props.cliente.bairro,
          cidade: this.props.cliente.cidade,
          uf: this.props.cliente.uf,
          erros: {},
          tipoTelefone: 'Celular',
          numeroTelefone: '',
          mascaraTelefone: '(99)99999-9999',
          telefones: [],
          email: '',
          emails: []
      }

      this.getTelefones();
      this.getEmails();
  }

  getTelefones = () => {
    let token = localStorage.getItem('token');
    axios.get('http://localhost:8080/telefones/' + 
      this.props.cliente.id + '?token=' + token).then(res => {
        this.setState({telefones:res.data})
      })
  }

  getEmails = () => {
    let token = localStorage.getItem('token');
    axios.get('http://localhost:8080/emails/' + 
      this.props.cliente.id + '?token=' + token).then(res => {
        console.log(res);
        let emails = res.data;
        emails = emails.map(email => email.email);
        this.setState({emails:emails});
      })
  }

  atualizaCampo = (campo, valor) => {
    var novoEstado = Object.assign({}, this.state);
    novoEstado[campo] = valor;
    novoEstado['erros'][campo] = '';
    this.setState(novoEstado);

  }
  
  atualizaTipo = valor => {
    this.setState({
      tipoTelefone: valor, numeroTelefone: ''
    });

    if (valor === "Celular") {
      this.setState({mascaraTelefone: '(99)99999-9999'});
    } else {
      this.setState({mascaraTelefone: '(99)9999-9999'});
    }

  }

  formataTelefone(tipo, numero){
    numero = numero.replace(/[^\d]/g, "");
    if (tipo === "Celular") {
      return numero.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
    } else {
      return numero.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
    }  
  }

  adicionaTefone = e => {
    e.preventDefault();
    
    let telefones = this.state.telefones;

    telefones.push({
      tipo: this.state.tipoTelefone,
      numero: this.state.numeroTelefone.replace(/[^\d]/g, "") 
    });

    console.log(telefones);

    this.setState({telefones:telefones});
  }

  adicionaEmail = e => {
    e.preventDefault();
    
    if (validator.isEmail(this.state.email)) {
      let emails = this.state.emails;
      emails.push(this.state.email);
      this.setState({email: '', emails:emails})
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'E-mail inválido',
        showConfirmButton: true
        });  
    }

  }

  validacao(){
    let erros = {};
    let formEstaValido = true;

    //nome
    if(!this.state.nome){
       formEstaValido = false;
       erros["nome"] = "Campo nome é obrigatorio";
    } else if(!this.state.nome.match(/^[a-zA-Z0-9_ ]{3,100}$/)){
        formEstaValido = false;
        erros["nome"] = "O campo nome deve ter entre 3 e 100 caracteres";
    }

    //cpf
    if(!this.state.cpf){
        formEstaValido = false;
        erros["cpf"] = "Campo cpf é obrigatorio";
    }

    if(!this.state.cep){
        formEstaValido = false;
        erros["cep"] = "Campo cep é obrigatorio";
    }

    if(!this.state.logradouro){
        formEstaValido = false;
        erros["logradouro"] = "Campo logradouro é obrigatorio";
    }

    if(!this.state.bairro){
        formEstaValido = false;
        erros["bairro"] = "Campo bairro é obrigatorio";
    }

    if(!this.state.cidade){
        formEstaValido = false;
        erros["cidade"] = "Campo cidade é obrigatorio";
    }

    if(!this.state.uf){
        formEstaValido = false;
        erros["uf"] = "Campo uf é obrigatorio";
    }

   this.setState({erros: erros});
   return formEstaValido;
 }

 getCep() {
    
    fetch(`https://viacep.com.br/ws/${this.state.cep}/json/`)
      .then(response => response.json())
      .then(data => {
        this.setState(state => ({
            logradouro: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
        }));    
      });
  }


  adicionar = e => {
    e.preventDefault();
    if (!this.validacao()) {
        return Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Preencher campos obrigatórios',
            showConfirmButton: true
            });
    }

    if (this.state.telefones.length === 0){
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Tem que haver pelo menos um telefone',
        showConfirmButton: true
        });  
    }

    if (this.state.emails.length === 0){
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Tem que haver pelo menos um emails',
        showConfirmButton: true
        });  
    }

    const clienteAlterado = {
        nome: this.state.nome,
        cpf: this.state.cpf.replace(/\D/g, ""),
        cep: this.state.cep.replace(/\D/g, ""),
        logradouro: this.state.logradouro,
        complemento: this.state.complemento,
        bairro: this.state.bairro,
        cidade: this.state.cidade,
        uf: this.state.uf
    }

    // salvar clinete
    let token = localStorage.getItem('token');
    axios.put('http://localhost:8080/clientes/' +
      this.props.cliente.id + '?token=' + token, clienteAlterado).then(res => {
      if (res.data.erro) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: res.data.mensagem,
          showConfirmButton: true
        });  
      } else {
        let idCliente = res.data.dados.id;
        
        //salvar telefones
        let telefones = this.state.telefones.map(tel => {
          let novoTel = {
            tipo: tel.tipo,
            numero: tel.numero,
            id_cliente: idCliente
          }
          return novoTel;
        });

        axios.post('http://localhost:8080/telefones/varios/' + 
          idCliente + '?token=' + token, telefones).then(res =>{
          if (res.data.erro) {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: res.data.mensagem,
              showConfirmButton: true
            });    
          } else {
            let emails = this.state.emails.map(email =>{
              return {
                email:email,
                id_cliente: idCliente
              }
            })
            axios.post('http://localhost:8080/emails/varios/' +
            idCliente + '?token=' + token, emails).then(res => {
              console.log(res);
            });
          }
        });
        
        
        this.props.setEstaEditando(false);
        this.props.atualiza();

        Swal.fire({
          icon: 'success',
          title: 'Alterado!',
          text: `${this.state.nome} foi alterado com sucesso`,
          showConfirmButton: false,
          timer: 1500
        });
      }
      console.log(res);
    })
      
  }

  removeTelefone = (e, telefone) => {
    let telefones = this.state.telefones.filter(tel => (tel.numero !== telefone.numero) || (tel.tipo !== telefone.tipo));
    this.setState({telefones:telefones});
  }

  removeEmail = (e, email) => {
    let emails = this.state.emails.filter(em => em !== email);
    this.setState({emails:emails});
  }

  render() {
    return (
        <div className="small-container">
          <form method="get" onSubmit={this.adicionar}>
          <h4>Novo Cliente</h4>
            <div style={{width: "800px", display:'table'}}>              
              <div style={{width: "400px", float:"left"}}>
                <div class="form-group form-inline"> 
                  <label style={{textAlign:"initial"}} htmlFor="nome">Nome</label>
                  <input 
                    style={{ height: 30 }}                           
                    //id="nome"
                    type="text"
                    //name="nome"
                    maxLength="100"
                    minLength="3"
                    value={this.state.nome}
                    onChange={e => this.atualizaCampo('nome', e.target.value)}
                  />
                </div>  
                <span style={{color: "red"}}>{this.state.erros["nome"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="cpf">CPF</label>
                <InputMask            
                  style={{ height: 30 }}
                  type="text"
                  mask="999.999.999-99"
                  value={this.state.cpf}
                  onChange={e => this.atualizaCampo('cpf', e.target.value)}
                />
                <span style={{color: "red"}}>{this.state.erros["cpf"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="cep">CEP</label>
                <InputMask
                  style={{ height: 30 }}                    
                  type="text"
                  mask="99999-999"
                  value={this.state.cep}
                  onChange={e => this.atualizaCampo('cep', e.target.value)}
                  onBlur={e => this.getCep()}
                />
                <span style={{color: "red"}}>{this.state.erros["cep"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="logradouro">Logradouro</label>
                <input
                  style={{ height: 30 }}    
                  id="logradouro"
                  type="text"
                  name="logradouro"
                  value={this.state.logradouro}
                  onChange={e => this.atualizaCampo('logradouro', e.target.value)}
                />
                <span style={{color: "red"}}>{this.state.erros["logradouro"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="complemento">Complemento</label>
                <input
                  style={{ height: 30 }}    
                  id="complemento"
                  type="text"
                  name="complemento"
                  value={this.state.complemento}
                  onChange={e => this.atualizaCampo('complemento', e.target.value)}
                />            
                <label style={{textAlign:"initial"}} htmlFor="bairro">Bairro</label>
                <input
                  style={{ height: 30 }} 
                  id="bairro"
                  type="text"
                  name="bairro"
                  value={this.state.bairro}
                  onChange={e => this.atualizaCampo('bairro', e.target.value)}
                />
                <span style={{color: "red"}}>{this.state.erros["bairro"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="cidade">Cidade</label>
                <input
                  style={{ height: 30 }}    
                  id="cidade"
                  type="text"
                  name="cidade"
                  value={this.state.cidade}
                  onChange={e => this.atualizaCampo('cidade', e.target.value)}
                />
                <span style={{color: "red"}}>{this.state.erros["cidade"]}</span>
                <label style={{textAlign:"initial"}} htmlFor="uf">UF</label>
                <input
                  style={{ height: 30 }}  
                  id="uf"
                  type="text"
                  name="uf"
                  value={this.state.uf}
                  onChange={e => this.atualizaCampo('uf', e.target.value)}
                />
                <span style={{color: "red"}}>{this.state.erros["uf"]}</span>              
              </div>
              <div style={{width: "380px", float:"right", display:"inline-grid"}}>
                <span>Telefone</span>
                <div style={{padding: "10px"}}>                  
                  <div style={{width:"35%", float:"left"}}>                    
                    <label style={{textAlign:"initial"}} htmlFor="uf">Tipo</label>
                    <select value={this.state.tipoTelefone} onChange={e => this.atualizaTipo(e.target.value)}>
                      <option value="Celular">Celular</option>
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                    </select>  
                  </div>
                  <div style={{width:"45%", padding:"0 5px", float:"left"}}>
                    <label style={{textAlign:"initial"}} htmlFor="uf">Número</label>
                    <InputMask
                      mask={this.state.mascaraTelefone}
                      style={{ height: 42 }}
                      type="text"
                      value={this.state.numeroTelefone}
                      onChange={e => this.atualizaCampo('numeroTelefone', e.target.value)}
                    />
                  </div>
                  <div style={{width:"20%", float:"right", padding:"25px 0 0 0"}}>
                    <button
                      onClick={e => this.adicionaTefone(e)}
                    >
                      <FontAwesomeIcon icon={faAngleDoubleDown} />
                    </button>
                  </div>
                </div>

                {this.state.telefones.map((telefone) => (
                  <div>
                    <div style={{float: "left", width:"35%"}}>
                      <span>{telefone.tipo}</span>
                    </div>
                    <div style={{float: "left", width:"45%"}}>
                      <span>{this.formataTelefone(telefone.tipo, telefone.numero)}</span>
                    </div>
                    <div style={{float: "left", width:"20%"}}>
                      <span style={{cursor:"pointer"}} onClick={e => this.removeTelefone(e, telefone)}>X</span>
                    </div>
                  </div>
                ))}

              </div>
              <div style={{width: "380px", float:"right", display:"inline-grid", margin:"25px 0 0 0"}}>                
                <div style={{padding: "10px"}}>                                    
                  <div style={{width:"80%", padding:"0 5px", float:"left"}}>
                    <label style={{textAlign:"initial"}}>E-mail</label>
                    <input
                      style={{ height: 42 }}
                      type="email"
                      value={this.state.email}
                      onChange={e => this.atualizaCampo("email", e.target.value)}
                    />
                  </div>
                  <div style={{width:"20%", float:"right", padding:"25px 0 0 0"}}>
                    <button
                      onClick={this.adicionaEmail}
                    >
                      <FontAwesomeIcon icon={faAngleDoubleDown} />
                    </button>
                  </div>
                </div>

                {this.state.emails.map((email) => (
                  <div>                    
                    <div style={{float: "left", width:"80%"}}>
                      <span>{email}</span>
                    </div>
                    <div style={{float: "left", width:"20%"}}>
                      <span style={{cursor:"pointer"}} onClick={e => this.removeEmail(e, email)}>X</span>
                    </div>
                  </div>
                ))}
              </div>              
            </div>
            <div style={{ marginTop: '30px' }}>
                  <input type="submit" value="Alterar" />
                  <input
                    style={{ marginLeft: '12px' }}
                    className="muted-button"
                    type="button"
                    value="Cancelar"
                    onClick={() => this.props.setEstaEditando(false)}
                  />
            </div>
          </form>
        </div>
      );
  }
};