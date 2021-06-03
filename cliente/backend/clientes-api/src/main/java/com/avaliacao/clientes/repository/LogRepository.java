package com.avaliacao.clientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.avaliacao.clientes.model.Log;

@Repository
public interface LogRepository extends JpaRepository<Log, Long>{

}
