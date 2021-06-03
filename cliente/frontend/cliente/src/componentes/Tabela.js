import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class Tabela extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props); 
  }

  formataCPF(cpf){
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  formataCep(cep) {
    cep = cep.replace(/[^\d]/g, "");
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  render() { 
    return (
        <div className="contain-table">
        <table className="striped-table">
            <thead>
            <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>CEP</th>
                <th>Logradouro</th>
                <th>Complemento</th>
                <th>Bairro</th>
                <th>Cidade</th>
                <th>UF</th>
                <th colSpan={2} className="text-center">
                Ações
                </th>
            </tr>
            </thead>
            <tbody style={{ fontSize: 14 }}>
            {this.props.clientes.length > 0 ? (
                this.props.clientes.map((cliente, i) => (
                <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{this.formataCPF(cliente.cpf)}</td>
                    <td>{this.formataCep(cliente.cep)}</td>
                    <td>{cliente.logradouro}</td>
                    <td>{cliente.complemento} </td>
                    <td>{cliente.bairro} </td>
                    <td>{cliente.cidade} </td>
                    <td>{cliente.uf} </td>
                    <td style={{width:"150px"}}>                   

                        <button style={{margin:"2px"}}
                            onClick={() => this.props.editar(cliente.id)}
                            className="button muted-button"
                        >
                            <FontAwesomeIcon color="blue" icon={faEdit} />
                        </button>
                        
                        <button style={{margin:"2px"}}
                            onClick={() => this.props.excluir(cliente.id)}
                            className="button muted-button"
                        >
                            <FontAwesomeIcon color="red" icon={faTrash} />
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={7}>Sem clientes</td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
  }
}
