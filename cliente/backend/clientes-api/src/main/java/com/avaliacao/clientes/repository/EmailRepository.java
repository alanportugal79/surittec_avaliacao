package com.avaliacao.clientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.avaliacao.clientes.model.Email;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long>{

}
