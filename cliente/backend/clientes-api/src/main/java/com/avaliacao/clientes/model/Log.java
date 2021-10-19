package com.avaliacao.clientes.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Log {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String operacao;
	
	@Column(nullable = false)
	private String tabela;
	
	@Column(nullable = false)
	private Date data;
	
	@Column(nullable = false)
	private String usuario;
	
	
	
	
}