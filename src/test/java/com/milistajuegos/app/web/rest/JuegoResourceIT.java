package com.milistajuegos.app.web.rest;

import com.milistajuegos.app.StefanApp;
import com.milistajuegos.app.domain.Juego;
import com.milistajuegos.app.repository.JuegoRepository;
import com.milistajuegos.app.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.milistajuegos.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link JuegoResource} REST controller.
 */
@SpringBootTest(classes = StefanApp.class)
public class JuegoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVACIONES = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVACIONES = "BBBBBBBBBB";

    private static final String DEFAULT_PLATAFORMA = "AAAAAAAAAA";
    private static final String UPDATED_PLATAFORMA = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_FECHA_INICIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_INICIO = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_ESTADO = "AAAAAAAAAA";
    private static final String UPDATED_ESTADO = "BBBBBBBBBB";

    @Autowired
    private JuegoRepository juegoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restJuegoMockMvc;

    private Juego juego;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final JuegoResource juegoResource = new JuegoResource(juegoRepository);
        this.restJuegoMockMvc = MockMvcBuilders.standaloneSetup(juegoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Juego createEntity(EntityManager em) {
        Juego juego = new Juego()
            .nombre(DEFAULT_NOMBRE)
            .descripcion(DEFAULT_DESCRIPCION)
            .observaciones(DEFAULT_OBSERVACIONES)
            .plataforma(DEFAULT_PLATAFORMA)
            .fechaFin(DEFAULT_FECHA_FIN)
            .fechaInicio(DEFAULT_FECHA_INICIO)
            .estado(DEFAULT_ESTADO);
        return juego;
    }

    @BeforeEach
    public void initTest() {
        juego = createEntity(em);
    }

    @Test
    @Transactional
    public void createJuego() throws Exception {
        int databaseSizeBeforeCreate = juegoRepository.findAll().size();

        // Create the Juego
        restJuegoMockMvc.perform(post("/api/juegos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(juego)))
            .andExpect(status().isCreated());

        // Validate the Juego in the database
        List<Juego> juegoList = juegoRepository.findAll();
        assertThat(juegoList).hasSize(databaseSizeBeforeCreate + 1);
        Juego testJuego = juegoList.get(juegoList.size() - 1);
        assertThat(testJuego.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testJuego.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testJuego.getObservaciones()).isEqualTo(DEFAULT_OBSERVACIONES);
        assertThat(testJuego.getPlataforma()).isEqualTo(DEFAULT_PLATAFORMA);
        assertThat(testJuego.getFechaFin()).isEqualTo(DEFAULT_FECHA_FIN);
        assertThat(testJuego.getFechaInicio()).isEqualTo(DEFAULT_FECHA_INICIO);
        assertThat(testJuego.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    @Transactional
    public void createJuegoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = juegoRepository.findAll().size();

        // Create the Juego with an existing ID
        juego.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restJuegoMockMvc.perform(post("/api/juegos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(juego)))
            .andExpect(status().isBadRequest());

        // Validate the Juego in the database
        List<Juego> juegoList = juegoRepository.findAll();
        assertThat(juegoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllJuegos() throws Exception {
        // Initialize the database
        juegoRepository.saveAndFlush(juego);

        // Get all the juegoList
        restJuegoMockMvc.perform(get("/api/juegos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(juego.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE.toString())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION.toString())))
            .andExpect(jsonPath("$.[*].observaciones").value(hasItem(DEFAULT_OBSERVACIONES.toString())))
            .andExpect(jsonPath("$.[*].plataforma").value(hasItem(DEFAULT_PLATAFORMA.toString())))
            .andExpect(jsonPath("$.[*].fechaFin").value(hasItem(DEFAULT_FECHA_FIN.toString())))
            .andExpect(jsonPath("$.[*].fechaInicio").value(hasItem(DEFAULT_FECHA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())));
    }
    
    @Test
    @Transactional
    public void getJuego() throws Exception {
        // Initialize the database
        juegoRepository.saveAndFlush(juego);

        // Get the juego
        restJuegoMockMvc.perform(get("/api/juegos/{id}", juego.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(juego.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE.toString()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION.toString()))
            .andExpect(jsonPath("$.observaciones").value(DEFAULT_OBSERVACIONES.toString()))
            .andExpect(jsonPath("$.plataforma").value(DEFAULT_PLATAFORMA.toString()))
            .andExpect(jsonPath("$.fechaFin").value(DEFAULT_FECHA_FIN.toString()))
            .andExpect(jsonPath("$.fechaInicio").value(DEFAULT_FECHA_INICIO.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingJuego() throws Exception {
        // Get the juego
        restJuegoMockMvc.perform(get("/api/juegos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateJuego() throws Exception {
        // Initialize the database
        juegoRepository.saveAndFlush(juego);

        int databaseSizeBeforeUpdate = juegoRepository.findAll().size();

        // Update the juego
        Juego updatedJuego = juegoRepository.findById(juego.getId()).get();
        // Disconnect from session so that the updates on updatedJuego are not directly saved in db
        em.detach(updatedJuego);
        updatedJuego
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .observaciones(UPDATED_OBSERVACIONES)
            .plataforma(UPDATED_PLATAFORMA)
            .fechaFin(UPDATED_FECHA_FIN)
            .fechaInicio(UPDATED_FECHA_INICIO)
            .estado(UPDATED_ESTADO);

        restJuegoMockMvc.perform(put("/api/juegos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedJuego)))
            .andExpect(status().isOk());

        // Validate the Juego in the database
        List<Juego> juegoList = juegoRepository.findAll();
        assertThat(juegoList).hasSize(databaseSizeBeforeUpdate);
        Juego testJuego = juegoList.get(juegoList.size() - 1);
        assertThat(testJuego.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testJuego.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testJuego.getObservaciones()).isEqualTo(UPDATED_OBSERVACIONES);
        assertThat(testJuego.getPlataforma()).isEqualTo(UPDATED_PLATAFORMA);
        assertThat(testJuego.getFechaFin()).isEqualTo(UPDATED_FECHA_FIN);
        assertThat(testJuego.getFechaInicio()).isEqualTo(UPDATED_FECHA_INICIO);
        assertThat(testJuego.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    @Transactional
    public void updateNonExistingJuego() throws Exception {
        int databaseSizeBeforeUpdate = juegoRepository.findAll().size();

        // Create the Juego

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJuegoMockMvc.perform(put("/api/juegos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(juego)))
            .andExpect(status().isBadRequest());

        // Validate the Juego in the database
        List<Juego> juegoList = juegoRepository.findAll();
        assertThat(juegoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteJuego() throws Exception {
        // Initialize the database
        juegoRepository.saveAndFlush(juego);

        int databaseSizeBeforeDelete = juegoRepository.findAll().size();

        // Delete the juego
        restJuegoMockMvc.perform(delete("/api/juegos/{id}", juego.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Juego> juegoList = juegoRepository.findAll();
        assertThat(juegoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Juego.class);
        Juego juego1 = new Juego();
        juego1.setId(1L);
        Juego juego2 = new Juego();
        juego2.setId(juego1.getId());
        assertThat(juego1).isEqualTo(juego2);
        juego2.setId(2L);
        assertThat(juego1).isNotEqualTo(juego2);
        juego1.setId(null);
        assertThat(juego1).isNotEqualTo(juego2);
    }
}
