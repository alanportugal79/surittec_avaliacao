package com.avaliacao.clientes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.avaliacao.clientes.model.ApiRetorno;
import com.avaliacao.clientes.model.Cliente;
import com.avaliacao.clientes.model.Email;
import com.avaliacao.clientes.model.Telefone;
import com.avaliacao.clientes.repository.ClienteRepository;
import com.avaliacao.clientes.repository.EmailRepository;
import com.avaliacao.clientes.repository.TelefoneRepository;


@CrossOrigin
@RestController
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
	private ClienteRepository clienteRepository;
	
	@Autowired
	private TelefoneRepository telefoneRepository;
	
	@Autowired
	private EmailRepository emailRepository;
		
	@GetMapping
	public ResponseEntity<ApiRetorno> listar(@RequestParam("token") String token) {
				
		
		ApiRetorno ret = new ApiRetorno();
		
		if (Permissao.validarToken(token, "comum") || Permissao.validarToken(token, "admin")) {
			ret.setErro(false);
			ret.setMensagem("Lista atualizada");
			ret.setDados(clienteRepository.findAll());
			
		} else {
			ret.setErro(true);
			ret.setMensagem("Sem permissão");
			ret.setDados(null);
		}
		
		return ResponseEntity.ok().body(ret);
		
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ApiRetorno> listarPorId(
			@PathVariable("id") long id,
			@RequestParam("token") String token) {
				
		
		ApiRetorno ret = new ApiRetorno();
		
		if (Permissao.validarToken(token, "comum") || Permissao.validarToken(token, "admin")) {
			ret.setErro(false);
			ret.setMensagem("Lista atualizada");
			ret.setDados(clienteRepository.findById(id));
			
		} else {
			ret.setErro(true);
			ret.setMensagem("Sem permissão");
			ret.setDados(null);
		}
		
		return ResponseEntity.ok().body(ret);
		
	}
	
	@CrossOrigin
	@PostMapping
	public ResponseEntity<ApiRetorno> adicionar(
			@RequestParam("token") String token, 
			@RequestBody Cliente cliente) {		
		
		ApiRetorno ret = new ApiRetorno();
		if (Permissao.validarToken(token, "admin")) { 
			Cliente salvo = clienteRepository.save(cliente);
			ret.setErro(false);
			ret.setMensagem("Salvo com sucesso");
			ret.setDados(salvo);
			return ResponseEntity.ok().body(ret);
		} else {
			ret.setErro(true);
			ret.setMensagem("Sem Permissão");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		}
	}
	
	@CrossOrigin
	@PutMapping(value="/{id}")
	public ResponseEntity<ApiRetorno> editar(
			@PathVariable("id") long id, 
			@RequestParam("token") String token, 
			@RequestBody Cliente cliente) {
		
		
		ApiRetorno ret = new ApiRetorno();
		if (Permissao.validarToken(token, "admin")) {
			return clienteRepository.findById(id)
					.map(registro -> {
						registro.setNome(cliente.getNome());
						registro.setCpf(cliente.getCpf());
						registro.setCep(cliente.getCep());
						registro.setLogradouro(cliente.getLogradouro());
						registro.setComplemento(cliente.getComplemento());
						registro.setBairro(cliente.getBairro());
						registro.setCidade(cliente.getCidade());
						registro.setUf(cliente.getUf());
						
						Cliente atualizado = clienteRepository.save(registro);
						
						ret.setErro(false);
						ret.setMensagem("Salvo com sucesso");
						ret.setDados(atualizado);
						
						
						return ResponseEntity.ok().body(ret);
					}).orElse(ResponseEntity.notFound().build());
		} else {
			ret.setErro(true);
			ret.setMensagem("Sem permissão");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		}
	}
	
	@CrossOrigin
	@DeleteMapping(path ={"/{id}"})
	public ResponseEntity<?> delete(@PathVariable long id, @RequestParam("token") String token) {
	
		
		ApiRetorno ret = new ApiRetorno();
		if (Permissao.validarToken(token, "admin")) {		
					
			// remover todos os telefones do cliente
			for (Telefone t : telefoneRepository.findAll()) {
				if (t.getId_cliente() == id) {
					telefoneRepository.deleteById(t.getId());
				}
			}
			
			// remover todos os emails do cliente
			for (Email e : emailRepository.findAll()) {
				if (e.getId_cliente() == id) {
					emailRepository.deleteById(e.getId());
				}
			}
			
			return clienteRepository.findById(id)
	           .map(registro -> {
	        	   clienteRepository.deleteById(id);
	        	   ret.setErro(false);
				   ret.setMensagem("Excluído coms sucesso");
				   ret.setDados(null);
	        	   return ResponseEntity.ok().body(ret);
	           }).orElse(ResponseEntity.notFound().build());
		} else {
			ret.setErro(true);
			ret.setMensagem("Sem permissão");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
			
		}
	} 
}
