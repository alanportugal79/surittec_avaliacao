package com.avaliacao.clientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.avaliacao.clientes.model.Telefone;

@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, Long>{
	

}

