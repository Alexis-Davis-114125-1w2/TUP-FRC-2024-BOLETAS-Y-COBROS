package com.example.bill_service.config;

import com.example.bill_service.dto.BillDTO;
import com.example.bill_service.model.Bill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.modelmapper.ModelMapper;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.typeMap(Bill.class, BillDTO.class).addMappings(mapper -> {
            mapper.map(Bill::getId, BillDTO::setId);
            mapper.map(Bill::getOwnerId, BillDTO::setOwnerId);
            mapper.map(Bill::getBillAmount, BillDTO::setBillAmount);
            mapper.map(Bill::getFirstExpirationDate, BillDTO::setFirstExpirationDate);
            mapper.map(Bill::getFirstExpirationAmount, BillDTO::setFirstExpirationAmount);
            mapper.map(Bill::getSecondExpirationDate, BillDTO::setSecondExpirationDate);
            mapper.map(Bill::getSecondExpirationAmount, BillDTO::setSecondExpirationAmount);

            mapper.map(src -> src.getStatus().getDescription(), BillDTO::setStatus);
            mapper.map(src -> src.getPaymentMethod().getDescription(), BillDTO::setPaymentMethod);
        });
        return modelMapper;
    }


}
