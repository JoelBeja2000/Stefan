package com.milistajuegos.app.web.rest;

import com.milistajuegos.app.domain.Juego;
import com.milistajuegos.app.repository.JuegoRepository;
import com.milistajuegos.app.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.milistajuegos.app.domain.Juego}.
 */
@RestController
@RequestMapping("/api")
public class JuegoResource {

    private final Logger log = LoggerFactory.getLogger(JuegoResource.class);

    private static final String ENTITY_NAME = "juego";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JuegoRepository juegoRepository;

    public JuegoResource(JuegoRepository juegoRepository) {
        this.juegoRepository = juegoRepository;
    }

    /**
     * {@code POST  /juegos} : Create a new juego.
     *
     * @param juego the juego to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new juego, or with status {@code 400 (Bad Request)} if the juego has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/juegos")
    public ResponseEntity<Juego> createJuego(@RequestBody Juego juego) throws URISyntaxException {
        log.debug("REST request to save Juego : {}", juego);
        if (juego.getId() != null) {
            throw new BadRequestAlertException("A new juego cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Juego result = juegoRepository.save(juego);
        return ResponseEntity.created(new URI("/api/juegos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /juegos} : Updates an existing juego.
     *
     * @param juego the juego to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated juego,
     * or with status {@code 400 (Bad Request)} if the juego is not valid,
     * or with status {@code 500 (Internal Server Error)} if the juego couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/juegos")
    public ResponseEntity<Juego> updateJuego(@RequestBody Juego juego) throws URISyntaxException {
        log.debug("REST request to update Juego : {}", juego);
        if (juego.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Juego result = juegoRepository.save(juego);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, juego.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /juegos} : get all the juegos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of juegos in body.
     */
    @GetMapping("/juegos")
    public List<Juego> getAllJuegos() {
        log.debug("REST request to get all Juegos");
        return juegoRepository.findAll();
    }

    /**
     * {@code GET  /juegos/:id} : get the "id" juego.
     *
     * @param id the id of the juego to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the juego, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/juegos/{id}")
    public ResponseEntity<Juego> getJuego(@PathVariable Long id) {
        log.debug("REST request to get Juego : {}", id);
        Optional<Juego> juego = juegoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(juego);
    }

    /**
     * {@code DELETE  /juegos/:id} : delete the "id" juego.
     *
     * @param id the id of the juego to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/juegos/{id}")
    public ResponseEntity<Void> deleteJuego(@PathVariable Long id) {
        log.debug("REST request to delete Juego : {}", id);
        juegoRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
