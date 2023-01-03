package com.rossie.internalapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rossie.internalapi.config.TestConfig;
import com.rossie.internalapi.configuration.WebSecurity;
import com.rossie.internalapi.model.InfoResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebMvcTest(
        controllers = PublicController.class,
        includeFilters = @ComponentScan.Filter(classes = EnableWebSecurity.class),
        properties = {
                "logging.level.root=INFO",
        }
)
@ContextConfiguration(classes = {
        PublicController.class,
        WebSecurity.class,
        TestConfig.class
})
class PublicControllerTest {

        private static final String REST_API_ENDPOINT = "/api/public/v1";

        @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        void shouldGetResultFromPublicEndpoint() throws Exception {

            final MockHttpServletRequestBuilder builder = MockMvcRequestBuilders.get(REST_API_ENDPOINT + "/info")
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .accept(MediaType.APPLICATION_JSON)
                    .characterEncoding("UTF-8");

            final MvcResult result = this.mockMvc.perform(builder)
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andReturn();

            final InfoResult info = objectMapper.readValue(result.getResponse().getContentAsString(), InfoResult.class);
            Assertions.assertEquals("Some public info...", info.getInfo());
        }
}

