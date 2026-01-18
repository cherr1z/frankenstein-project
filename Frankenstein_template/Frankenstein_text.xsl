<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>

    <xsl:template match="tei:body">
        <div class="row">
        <div class="col-3"><br/><br/><br/><br/><br/>
            <xsl:for-each select="//tei:add[@place = 'marginleft']">
                <div class="marginLeft">
                    <xsl:choose>
                        <xsl:when test="parent::tei:del">
                            <del>
                                <xsl:attribute name="class">
                                    <xsl:value-of select="attribute::hand" />
                                </xsl:attribute>
                                <xsl:apply-templates/></del><br/>
                        </xsl:when>
                        <xsl:otherwise>
                            <span>
                                <xsl:attribute name="class">
                                    <xsl:value-of select="attribute::hand" />
                                </xsl:attribute>
                            <xsl:apply-templates/><br/>
                            </span>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </xsl:for-each> 
        </div>
        <div class="col-9">
            <div class="transcription">
                <xsl:apply-templates select="//tei:div"/>
            </div>
        </div>
        </div> 
    </xsl:template>
    
    <xsl:template match="tei:div">
        <div class="#MWS"><xsl:apply-templates/></div>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p>
            <xsl:if test="@rend='indented'">
                <xsl:attribute name="class">indented</xsl:attribute>
            </xsl:if>
            <xsl:if test="@style">
                <xsl:attribute name="style">
                    <xsl:value-of select="@style"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
     <!-- Marginal additions -->
    <xsl:template match="tei:add[@place = 'marginleft']">
    <span class="marginAdd">
        <xsl:attribute name="class">
            <xsl:text>marginAdd</xsl:text>
            <xsl:value-of select="substring-after(@hand, '#')"/>
        </xsl:attribute>
        <xsl:apply-templates/>
    </span>
</xsl:template>
    
    <!-- Deletions with hand attribute -->
    <xsl:template match="tei:del">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="substring-after(@hand, '#')"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>
    
    <!-- Supralinear additions -->
    <xsl:template match="tei:add[@place = 'supralinear']">
        <span>
            <xsl:attribute name="class">
                <xsl:text>supraAdd </xsl:text>
                <xsl:value-of select="substring-after(@hand, '#')"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- Infralinear additions -->
    <xsl:template match="tei:add[@place = 'infralinear']">
        <span>
            <xsl:attribute name="class">
                <xsl:text>infraAdd </xsl:text>
                <xsl:value-of select="substring-after(@hand, '#')"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- Inline additions -->
    <xsl:template match="tei:add[@place = 'inline']">
        <span>
            <xsl:attribute name="class">
                <xsl:text>inlineAdd </xsl:text>
                <xsl:value-of select="substring-after(@hand, '#')"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- Line breaks -->
    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
    
    <!-- Highlighted/circled text -->
    <xsl:template match="tei:hi[@rend = 'circled']">
        <span class="circled">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:hi[@rend = 'sup']">
        <sup>
            <xsl:apply-templates/>
        </sup>
    </xsl:template>
    
    <!-- Metamark -->
    <xsl:template match="tei:metamark">
        <span class="metamark">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- Page break -->
    <xsl:template match="tei:pb">
        <div class="pagebreak">
            <xsl:text>[Page </xsl:text>
            <xsl:value-of select="substring-after(@facs, '#')"/>
            <xsl:text>]</xsl:text>
        </div>
    </xsl:template>    
</xsl:stylesheet>
