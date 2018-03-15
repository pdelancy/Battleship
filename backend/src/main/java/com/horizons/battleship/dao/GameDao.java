//package com.horizons.battleship.dao;
//
//import com.horizons.battleship.model.Game;
//import org.springframework.data.repository.CrudRepository;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Transactional
//public interface GameDao extends CrudRepository<Game,Integer> {
//    public Game findById(Integer id);
//    public List<Game> findAll();
//    public <S extends Game> S save(S game);
//    public void delete (Integer id);
//}
