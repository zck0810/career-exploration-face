package com.fangzai.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author smile
 * @since 2023-10-18
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("position_information")
@ApiModel(value="PositionInformation对象", description="")
public class PositionInformation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String job;

    private String city;

    private String companyName;

    private String salary;

    private String salaryMin;

    private String salaryMax;

    private String experience;

    private String education;

    private String positionStatement;

    private String welfare;

    private LocalDateTime insertTime;


}
